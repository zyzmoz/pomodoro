import type { PomodoroSettings } from "../types/pomodoro";
import { DEFAULT_THEME_COLORS } from "../helpers/colors";

export const SETTINGS_STORAGE_KEY = "@pomodoro:settings";

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workingTime: 15,
  breakTime: 5,
  primaryColor: DEFAULT_THEME_COLORS.primary,
  secondaryColor: DEFAULT_THEME_COLORS.secondary,
  tertiaryColor: DEFAULT_THEME_COLORS.tertiary,
};
