import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "../constants/pomodoro";
import { getThemeColors } from "./colors";
import type { PomodoroSettings } from "../types/pomodoro";

const isPomodoroSettings = (value: unknown): value is Omit<
  PomodoroSettings,
  | "primaryColor"
  | "secondaryColor"
  | "tertiaryColor"
  | "autoPlayRadioOnPomodoroStart"
  | "lowerRadioVolumeOnBreak"
> & {
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  autoPlayRadioOnPomodoroStart?: boolean;
  lowerRadioVolumeOnBreak?: boolean;
} => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const settings = value as Record<string, unknown>;
  return (
    typeof settings.workingTime === "number" &&
    typeof settings.breakTime === "number" &&
    (typeof settings.primaryColor === "string" || typeof settings.primaryColor === "undefined") &&
    (typeof settings.secondaryColor === "string" || typeof settings.secondaryColor === "undefined") &&
    (typeof settings.tertiaryColor === "string" || typeof settings.tertiaryColor === "undefined") &&
    (typeof settings.autoPlayRadioOnPomodoroStart === "boolean" ||
      typeof settings.autoPlayRadioOnPomodoroStart === "undefined") &&
    (typeof settings.lowerRadioVolumeOnBreak === "boolean" ||
      typeof settings.lowerRadioVolumeOnBreak === "undefined")
  );
};

export const loadSettings = (): PomodoroSettings => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!savedSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsedSettings: unknown = JSON.parse(savedSettings);

    if (!isPomodoroSettings(parsedSettings)) {
      return DEFAULT_SETTINGS;
    }

    const storedSettings = { ...DEFAULT_SETTINGS, ...parsedSettings };
    const themeColors = getThemeColors(
      storedSettings.primaryColor,
      storedSettings.secondaryColor,
      storedSettings.tertiaryColor
    );

    return {
      workingTime: storedSettings.workingTime,
      breakTime: storedSettings.breakTime,
      primaryColor: themeColors.primary,
      secondaryColor: themeColors.secondary,
      tertiaryColor: themeColors.tertiary,
      autoPlayRadioOnPomodoroStart: storedSettings.autoPlayRadioOnPomodoroStart,
      lowerRadioVolumeOnBreak: storedSettings.lowerRadioVolumeOnBreak,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: PomodoroSettings): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
