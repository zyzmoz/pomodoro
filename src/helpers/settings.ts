import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "../constants/pomodoro";
import type { PomodoroSettings } from "../types/pomodoro";

const isPomodoroSettings = (value: unknown): value is PomodoroSettings => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const settings = value as Record<string, unknown>;
  return (
    typeof settings.workingTime === "number" &&
    typeof settings.breakTime === "number"
  );
};

export const loadSettings = (): PomodoroSettings => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!savedSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsedSettings: unknown = JSON.parse(savedSettings);
    return isPomodoroSettings(parsedSettings) ? parsedSettings : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: PomodoroSettings): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
