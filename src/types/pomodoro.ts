export type PomodoroSettings = {
  workingTime: number;
  breakTime: number;
};

export type PomodoroState = {
  showSettings: boolean;
  settings: PomodoroSettings;
  pomodoroStarted: boolean;
  breakTime: boolean;
};
