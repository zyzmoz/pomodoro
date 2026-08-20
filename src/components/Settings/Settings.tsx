import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { XIcon } from "@primer/octicons-react";
import { DEFAULT_THEME_COLORS, getThemeColors } from "../../helpers/colors";
import type { PomodoroSettings } from "../../types/pomodoro";

type SettingsProps = {
  workingTime: number;
  breakTime: number;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  hideSettings: () => void;
  saveSettings: (settings: PomodoroSettings) => void;
};

const Settings = ({
  workingTime: initialWorkingTime,
  breakTime: initialBreakTime,
  primaryColor: initialPrimaryColor,
  secondaryColor: initialSecondaryColor,
  tertiaryColor: initialTertiaryColor,
  hideSettings,
  saveSettings,
}: SettingsProps) => {
  const [workingTime, setWorkingTime] = useState(initialWorkingTime);
  const [breakTime, setBreakTime] = useState(initialBreakTime);
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialSecondaryColor);
  const [tertiaryColor, setTertiaryColor] = useState(initialTertiaryColor);
  const colors = getThemeColors(primaryColor, secondaryColor, tertiaryColor);

  useEffect(() => {
    setWorkingTime(initialWorkingTime);
    setBreakTime(initialBreakTime);
    setPrimaryColor(initialPrimaryColor);
    setSecondaryColor(initialSecondaryColor);
    setTertiaryColor(initialTertiaryColor);
  }, [
    initialBreakTime,
    initialPrimaryColor,
    initialSecondaryColor,
    initialTertiaryColor,
    initialWorkingTime,
  ]);

  const updateWorkingTime = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setWorkingTime(Number(event.target.value));
  }, []);

  const updateBreakTime = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setBreakTime(Number(event.target.value));
  }, []);

  const updatePrimaryColor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextPrimaryColor = event.target.value.toUpperCase();
    const calculatedColors = getThemeColors(nextPrimaryColor);

    setPrimaryColor(nextPrimaryColor);
    setSecondaryColor(calculatedColors.secondary);
    setTertiaryColor(calculatedColors.tertiary);
  }, []);

  const updateSecondaryColor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextSecondaryColor = event.target.value.toUpperCase();
    const calculatedColors = getThemeColors(
      primaryColor,
      nextSecondaryColor,
      tertiaryColor
    );

    setSecondaryColor(calculatedColors.secondary);
  }, [primaryColor, tertiaryColor]);

  const updateTertiaryColor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextTertiaryColor = event.target.value.toUpperCase();
    const calculatedColors = getThemeColors(
      primaryColor,
      secondaryColor,
      nextTertiaryColor
    );

    setTertiaryColor(calculatedColors.tertiary);
  }, [primaryColor, secondaryColor]);

  const resetColors = useCallback(() => {
    setPrimaryColor(DEFAULT_THEME_COLORS.primary);
    setSecondaryColor(DEFAULT_THEME_COLORS.secondary);
    setTertiaryColor(DEFAULT_THEME_COLORS.tertiary);
  }, []);

  return (
    <section className="settings" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <button className="btn btn-clear btn-dark" type="button" aria-label="Close settings"
        onClick={hideSettings}
      >
        <XIcon size={16} />
      </button>
      <div className="settings-header">
        <h2 id="settings-title">Settings</h2>
      </div>
      <div className="settings-content">
        <div>
          <label htmlFor="working-time">Work duration</label>
          <input id="working-time" type="range" min="1" max="120" value={workingTime} onChange={updateWorkingTime} aria-describedby="working-time-value" />
          <output id="working-time-value">Working time: {workingTime} {workingTime > 1 ? 'minutes' : 'minute'}</output>
        </div>
        <div>
          <label htmlFor="break-time">Break duration</label>
          <input id="break-time" type="range" min="1" max="120" value={breakTime} onChange={updateBreakTime} aria-describedby="break-time-value" />
          <output id="break-time-value">Break: {breakTime} {breakTime > 1 ? 'minutes' : 'minute'}</output>
        </div>
        <div>
          <label htmlFor="primary-color">Primary color</label>
          <input
            id="primary-color"
            type="color"
            value={primaryColor}
            onChange={updatePrimaryColor}
          />
          <span id="color-contrast-help">Changing the primary color sets matching colors with at least 4.5:1 contrast. Custom colors must meet the same contrast requirement.</span>
          <label htmlFor="secondary-color">Secondary color</label>
          <input
            id="secondary-color"
            type="color"
            value={secondaryColor}
            onChange={updateSecondaryColor}
            aria-describedby="color-contrast-help"
          />
          <label htmlFor="tertiary-color">Tertiary color</label>
          <input
            id="tertiary-color"
            type="color"
            value={tertiaryColor}
            onChange={updateTertiaryColor}
            aria-describedby="color-contrast-help"
          />
          <div className="color-preview" aria-label="Theme colors">
            <span style={{ backgroundColor: colors.primary, color: colors.secondary }}>Primary</span>
            <span style={{ backgroundColor: colors.secondary, color: colors.primary }}>Secondary</span>
            <span style={{ backgroundColor: colors.tertiary, color: colors.primary }}>Tertiary</span>
          </div>
          <button className="btn btn-dark btn-full" type="button" onClick={resetColors}>
            Reset colors
          </button>
        </div>
      </div>
      <button className="btn btn-success btn-full" type="button"
        onClick={() =>
          saveSettings({
            workingTime,
            breakTime,
            primaryColor,
            secondaryColor,
            tertiaryColor,
          })
        }
      >
        Save
      </button>

    </section>
  );
};

export default Settings;
