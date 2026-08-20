import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULT_THEME_COLORS } from "../../src/helpers/colors";
import Settings from "../../src/components/Settings/Settings";

describe("Settings", () => {
  it("saves a customized color palette as values change", async () => {
    const saveSettings = jest.fn();
    const user = userEvent.setup();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#D8737F"
        secondaryColor="#111111"
        tertiaryColor="#000000"
        autoPlayRadioOnPomodoroStart={false}
        lowerRadioVolumeOnBreak={false}
        hideSettings={jest.fn()}
        saveSettings={saveSettings}
      />
    );

    await user.click(screen.getByRole("tab", { name: "Appearance" }));
    fireEvent.change(screen.getByLabelText("Primary color"), {
      target: { value: "#123456" },
    });
    fireEvent.change(screen.getByLabelText("Secondary color"), {
      target: { value: "#FFFFFF" },
    });
    fireEvent.change(screen.getByLabelText("Tertiary color"), {
      target: { value: "#FFFFFF" },
    });

    expect(saveSettings).toHaveBeenLastCalledWith({
      workingTime: 15,
      breakTime: 5,
      primaryColor: "#123456",
      secondaryColor: "#FFFFFF",
      tertiaryColor: "#FFFFFF",
      autoPlayRadioOnPomodoroStart: false,
      lowerRadioVolumeOnBreak: false,
    });
  });

  it("saves the default palette when colors are reset", async () => {
    const saveSettings = jest.fn();
    const user = userEvent.setup();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#123456"
        secondaryColor="#111111"
        tertiaryColor="#000000"
        autoPlayRadioOnPomodoroStart={false}
        lowerRadioVolumeOnBreak={false}
        hideSettings={jest.fn()}
        saveSettings={saveSettings}
      />
    );

    await user.click(screen.getByRole("tab", { name: "Appearance" }));
    await user.click(screen.getByRole("button", { name: "Reset colors" }));

    expect(saveSettings).toHaveBeenLastCalledWith({
      workingTime: 15,
      breakTime: 5,
      primaryColor: DEFAULT_THEME_COLORS.primary,
      secondaryColor: DEFAULT_THEME_COLORS.secondary,
      tertiaryColor: DEFAULT_THEME_COLORS.tertiary,
      autoPlayRadioOnPomodoroStart: false,
      lowerRadioVolumeOnBreak: false,
    });
  });

  it("saves Code Radio preferences as values change", async () => {
    const saveSettings = jest.fn();
    const user = userEvent.setup();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#D8737F"
        secondaryColor="#111111"
        tertiaryColor="#000000"
        autoPlayRadioOnPomodoroStart={false}
        lowerRadioVolumeOnBreak={false}
        hideSettings={jest.fn()}
        saveSettings={saveSettings}
      />
    );

    await user.click(screen.getByRole("tab", { name: "Code Radio" }));
    await user.click(screen.getByLabelText("Play Code Radio when a Pomodoro starts"));
    await user.click(screen.getByLabelText("Lower Code Radio volume around alerts"));

    expect(saveSettings).toHaveBeenLastCalledWith({
      autoPlayRadioOnPomodoroStart: true,
      breakTime: 5,
      lowerRadioVolumeOnBreak: true,
      primaryColor: "#D8737F",
      secondaryColor: "#111111",
      tertiaryColor: "#000000",
      workingTime: 15,
    });
  });

  it("saves timer durations as their sliders move", () => {
    const saveSettings = jest.fn();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#D8737F"
        secondaryColor="#111111"
        tertiaryColor="#000000"
        autoPlayRadioOnPomodoroStart={false}
        lowerRadioVolumeOnBreak={false}
        hideSettings={jest.fn()}
        saveSettings={saveSettings}
      />
    );

    fireEvent.change(screen.getByLabelText("Work duration"), {
      target: { value: "30" },
    });

    expect(saveSettings).toHaveBeenCalledWith({
      workingTime: 30,
      breakTime: 5,
      primaryColor: "#D8737F",
      secondaryColor: "#111111",
      tertiaryColor: "#000000",
      autoPlayRadioOnPomodoroStart: false,
      lowerRadioVolumeOnBreak: false,
    });
    expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
  });

  it("shows timer controls in the default tab and separates the other settings", async () => {
    const user = userEvent.setup();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#D8737F"
        secondaryColor="#412226"
        tertiaryColor="#000000"
        autoPlayRadioOnPomodoroStart={false}
        lowerRadioVolumeOnBreak={false}
        hideSettings={jest.fn()}
        saveSettings={jest.fn()}
      />
    );

    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(screen.getByLabelText("Close settings")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Timer" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Appearance" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Code Radio" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByLabelText("Work duration")).toBeTruthy();
    expect(screen.getByLabelText("Break duration")).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: "Appearance" }));

    expect(screen.getByLabelText("Primary color")).toBeTruthy();
    expect(screen.getByLabelText("Secondary color")).toBeTruthy();
    expect(screen.getByLabelText("Tertiary color")).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: "Code Radio" }));

    expect(screen.getByLabelText("Play Code Radio when a Pomodoro starts")).toBeTruthy();
    expect(screen.getByLabelText("Lower Code Radio volume around alerts")).toBeTruthy();
  });

  it("slides out before closing when the close button is clicked", async () => {
    const hideSettings = jest.fn();
    const user = userEvent.setup();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#D8737F"
        secondaryColor="#111111"
        tertiaryColor="#000000"
        autoPlayRadioOnPomodoroStart={false}
        lowerRadioVolumeOnBreak={false}
        hideSettings={hideSettings}
        saveSettings={jest.fn()}
      />
    );

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    await user.click(screen.getByLabelText("Close settings"));

    expect(dialog).toHaveClass("settings--closing");
    expect(hideSettings).not.toHaveBeenCalled();

    fireEvent.animationEnd(dialog, { animationName: "settings-slide-out" });

    expect(hideSettings).toHaveBeenCalledTimes(1);
  });

  it("closes when the user clicks outside the settings menu", () => {
    const hideSettings = jest.fn();

    render(
      <Settings
        workingTime={15}
        breakTime={5}
        primaryColor="#D8737F"
        secondaryColor="#111111"
        tertiaryColor="#000000"
        autoPlayRadioOnPomodoroStart={false}
        lowerRadioVolumeOnBreak={false}
        hideSettings={hideSettings}
        saveSettings={jest.fn()}
      />
    );

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    fireEvent.mouseDown(document.body);

    expect(dialog).toHaveClass("settings--closing");

    fireEvent.animationEnd(dialog, { animationName: "settings-slide-out" });

    expect(hideSettings).toHaveBeenCalledTimes(1);
  });
});
