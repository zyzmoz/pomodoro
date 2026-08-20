import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "../src/App";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "../src/constants/pomodoro";
import store from "../src/store";
import { pomodoroActions } from "../src/store/pomodoroSlice";

jest.mock("../src/assets/css/master.css", () => ({}));

describe("App", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_SETTINGS,
        lowerRadioVolumeOnBreak: true,
        workingTime: 1,
      })
    );
    store.dispatch(pomodoroActions.stopPomodoro());
    store.dispatch(pomodoroActions.stopBreak());
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("lowers Code Radio three seconds before an alert and restores it after eight seconds", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    act(() => {
      jest.advanceTimersByTime(58_000);
    });

    const audio = screen.getByLabelText("Code Radio stream") as HTMLAudioElement;
    expect(audio.volume).toBeCloseTo(0.2);
    expect(screen.getByLabelText("Code Radio volume")).toHaveValue("0.5");

    act(() => {
      jest.advanceTimersByTime(8_000);
    });

    expect(audio.volume).toBe(0.5);
  });
});
