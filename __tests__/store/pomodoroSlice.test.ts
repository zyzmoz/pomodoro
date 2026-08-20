import pomodoroReducer, { pomodoroActions } from "../../src/store/pomodoroSlice";

describe("pomodoroSlice", () => {
  it("uses the default settings before preferences are loaded", () => {
    expect(pomodoroReducer(undefined, { type: "unknown" })).toMatchObject({
      breakTime: false,
      pomodoroStarted: false,
      settings: { workingTime: 15, breakTime: 5 },
      showSettings: false,
    });
  });

  it("updates settings and tracks a break", () => {
    const settings = {
      workingTime: 25,
      breakTime: 10,
      primaryColor: "#D8737F",
      secondaryColor: "#222222",
      tertiaryColor: "#000000",
      autoPlayRadioOnPomodoroStart: true,
      lowerRadioVolumeOnBreak: true,
    };
    const withSettings = pomodoroReducer(
      undefined,
      pomodoroActions.saveSettings(settings)
    );

    expect(withSettings.settings).toEqual(settings);
    expect(
      pomodoroReducer(withSettings, pomodoroActions.startBreak()).breakTime
    ).toBe(true);
  });
});
