export type PomodoroSettings = {
  workingTime: number;
  breakTime: number;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  autoPlayRadioOnPomodoroStart: boolean;
  lowerRadioVolumeOnBreak: boolean;
};

export type RadioPlayerState = {
  isMuted: boolean;
  previousVolume: number;
  volume: number;
};

export type PomodoroState = {
  showSettings: boolean;
  settings: PomodoroSettings;
  pomodoroStarted: boolean;
  breakTime: boolean;
};
