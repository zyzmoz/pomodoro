import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RadioPlayer, {
  CODE_RADIO_NOW_PLAYING_URL,
  CODE_RADIO_STREAM_URL,
} from "../../src/components/RadioPlayer/RadioPlayer";

describe("RadioPlayer", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: jest.fn(),
    });
  });

  afterEach(() => {
    Object.defineProperty(global, "fetch", {
      configurable: true,
      value: undefined,
    });
  });

  it("plays and pauses the Code Radio stream", async () => {
    const user = userEvent.setup();

    render(<RadioPlayer />);

    const audio = screen.getByLabelText("Code Radio stream") as HTMLAudioElement;
    expect(audio.src).toBe(CODE_RADIO_STREAM_URL);

    await user.click(screen.getByRole("button", { name: "Play Code Radio" }));

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Pause Code Radio" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pause Code Radio" }));

    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Play Code Radio" })).toBeInTheDocument();
  });

  it("sets the volume to zero when muted and restores it when unmuted", async () => {
    const user = userEvent.setup();

    render(<RadioPlayer />);

    const audio = screen.getByLabelText("Code Radio stream") as HTMLAudioElement;
    await user.click(screen.getByRole("button", { name: "Mute Code Radio" }));

    expect(audio.muted).toBe(true);
    expect(audio.volume).toBe(0);
    expect(screen.getByRole("button", { name: "Unmute Code Radio" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Unmute Code Radio" }));

    expect(audio.muted).toBe(false);
    expect(audio.volume).toBe(0.5);
  });

  it("unmutes with a new volume when the slider changes", async () => {
    const user = userEvent.setup();

    render(<RadioPlayer />);

    const audio = screen.getByLabelText("Code Radio stream") as HTMLAudioElement;
    await user.click(screen.getByRole("button", { name: "Mute Code Radio" }));
    fireEvent.change(screen.getByLabelText("Code Radio volume"), { target: { value: "0.25" } });

    expect(audio.muted).toBe(false);
    expect(audio.volume).toBe(0.25);
    expect(screen.getByRole("button", { name: "Mute Code Radio" })).toBeInTheDocument();
  });

  it("shows the current Code Radio title and artist", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        now_playing: {
          song: {
            artist: "leavv",
            title: "within",
          },
        },
      }),
      ok: true,
    } as unknown as Response);
    Object.defineProperty(global, "fetch", {
      configurable: true,
      value: fetchMock,
    });

    render(<RadioPlayer />);

    expect(await screen.findByText("within")).toBeInTheDocument();
    expect(screen.getByText("leavv")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(CODE_RADIO_NOW_PLAYING_URL);
  });

  it("starts only when a Pomodoro begins and the auto-play preference is enabled", async () => {
    const { rerender } = render(
      <RadioPlayer
        autoPlayOnPomodoroStart
        lowerVolumeDuringBreak={false}
        pomodoroStarted={false}
        breakTime={false}
      />
    );

    rerender(
      <RadioPlayer
        autoPlayOnPomodoroStart
        lowerVolumeDuringBreak={false}
        pomodoroStarted
        breakTime={false}
      />
    );

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("button", { name: "Pause Code Radio" })).toBeInTheDocument();
  });

  it("remembers the mute and volume controls and lowers volume during a break", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<RadioPlayer />);

    fireEvent.change(screen.getByLabelText("Code Radio volume"), { target: { value: "0.45" } });
    await user.click(screen.getByRole("button", { name: "Mute Code Radio" }));
    unmount();

    const { rerender: rerenderPlayer } = render(
      <RadioPlayer
        autoPlayOnPomodoroStart={false}
        lowerVolumeDuringBreak
        pomodoroStarted={false}
        breakTime={false}
      />
    );
    const audio = screen.getByLabelText("Code Radio stream") as HTMLAudioElement;

    expect(audio.muted).toBe(true);
    expect(audio.volume).toBe(0);

    await user.click(screen.getByRole("button", { name: "Unmute Code Radio" }));
    expect(audio.volume).toBe(0.45);

    rerenderPlayer(
      <RadioPlayer
        autoPlayOnPomodoroStart={false}
        lowerVolumeDuringBreak
        pomodoroStarted={false}
        breakTime
      />
    );
    expect(audio.volume).toBe(0.2);

    rerenderPlayer(
      <RadioPlayer
        autoPlayOnPomodoroStart={false}
        lowerVolumeDuringBreak
        pomodoroStarted={false}
        breakTime={false}
      />
    );
    expect(audio.volume).toBe(0.45);
  });
});
