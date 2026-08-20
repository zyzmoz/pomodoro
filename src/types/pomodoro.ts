export type PomodoroSettings = {
  workingTime: number;
  breakTime: number;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
};

export type PomodoroState = {
  showSettings: boolean;
  settings: PomodoroSettings;
  pomodoroStarted: boolean;
  breakTime: boolean;
};
