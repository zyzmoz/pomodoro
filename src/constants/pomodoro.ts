import type { PomodoroSettings } from "../types/pomodoro";

export const SETTINGS_STORAGE_KEY = "@pomodoro:settings";

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workingTime: 15,
  breakTime: 5,
};
