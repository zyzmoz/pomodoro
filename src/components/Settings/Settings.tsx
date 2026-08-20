import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { XIcon } from "@primer/octicons-react";
import { DEFAULT_THEME_COLORS, getThemeColors } from "../../helpers/colors";
import type { PomodoroSettings } from "../../types/pomodoro";

type SettingsProps = PomodoroSettings & {
  hideSettings: () => void;
  saveSettings: (settings: PomodoroSettings) => void;
};

type SettingsTab = "timer" | "appearance" | "radio";

const getRangeStyle = (value: number, minimum: number, maximum: number): CSSProperties => ({
  "--range-progress": `${((value - minimum) / (maximum - minimum)) * 100}%`,
} as CSSProperties);

const Settings = ({
  workingTime: initialWorkingTime,
  breakTime: initialBreakTime,
  primaryColor: initialPrimaryColor,
  secondaryColor: initialSecondaryColor,
  tertiaryColor: initialTertiaryColor,
  autoPlayRadioOnPomodoroStart: initialAutoPlayRadioOnPomodoroStart,
  lowerRadioVolumeOnBreak: initialLowerRadioVolumeOnBreak,
  hideSettings,
  saveSettings,
}: SettingsProps) => {
  const [settings, setSettings] = useState<PomodoroSettings>(() => ({
    workingTime: initialWorkingTime,
    breakTime: initialBreakTime,
    primaryColor: initialPrimaryColor,
    secondaryColor: initialSecondaryColor,
    tertiaryColor: initialTertiaryColor,
    autoPlayRadioOnPomodoroStart: initialAutoPlayRadioOnPomodoroStart,
    lowerRadioVolumeOnBreak: initialLowerRadioVolumeOnBreak,
  }));
  const settingsRef = useRef(settings);
  const settingsMenuRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("timer");
  const [isClosing, setIsClosing] = useState(false);
  const colors = getThemeColors(
    settings.primaryColor,
    settings.secondaryColor,
    settings.tertiaryColor
  );

  useEffect(() => {
    const nextSettings = {
      workingTime: initialWorkingTime,
      breakTime: initialBreakTime,
      primaryColor: initialPrimaryColor,
      secondaryColor: initialSecondaryColor,
      tertiaryColor: initialTertiaryColor,
      autoPlayRadioOnPomodoroStart: initialAutoPlayRadioOnPomodoroStart,
      lowerRadioVolumeOnBreak: initialLowerRadioVolumeOnBreak,
    };

    settingsRef.current = nextSettings;
    setSettings(nextSettings);
  }, [
    initialAutoPlayRadioOnPomodoroStart,
    initialBreakTime,
    initialLowerRadioVolumeOnBreak,
    initialPrimaryColor,
    initialSecondaryColor,
    initialTertiaryColor,
    initialWorkingTime,
  ]);

  const updateSettings = useCallback((changes: Partial<PomodoroSettings>) => {
    const nextSettings = { ...settingsRef.current, ...changes };

    settingsRef.current = nextSettings;
    setSettings(nextSettings);
    saveSettings(nextSettings);
  }, [saveSettings]);

  const updateWorkingTime = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateSettings({ workingTime: Number(event.target.value) });
  }, [updateSettings]);

  const updateBreakTime = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    updateSettings({ breakTime: Number(event.target.value) });
  }, [updateSettings]);

  const updatePrimaryColor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextPrimaryColor = event.target.value.toUpperCase();
    const calculatedColors = getThemeColors(nextPrimaryColor);

    updateSettings({
      primaryColor: nextPrimaryColor,
      secondaryColor: calculatedColors.secondary,
      tertiaryColor: calculatedColors.tertiary,
    });
  }, [updateSettings]);

  const updateSecondaryColor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextSecondaryColor = event.target.value.toUpperCase();
    const calculatedColors = getThemeColors(
      settings.primaryColor,
      nextSecondaryColor,
      settings.tertiaryColor
    );

    updateSettings({ secondaryColor: calculatedColors.secondary });
  }, [settings.primaryColor, settings.tertiaryColor, updateSettings]);

  const updateTertiaryColor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextTertiaryColor = event.target.value.toUpperCase();
    const calculatedColors = getThemeColors(
      settings.primaryColor,
      settings.secondaryColor,
      nextTertiaryColor
    );

    updateSettings({ tertiaryColor: calculatedColors.tertiary });
  }, [settings.primaryColor, settings.secondaryColor, updateSettings]);

  const resetColors = useCallback(() => {
    updateSettings({
      primaryColor: DEFAULT_THEME_COLORS.primary,
      secondaryColor: DEFAULT_THEME_COLORS.secondary,
      tertiaryColor: DEFAULT_THEME_COLORS.tertiary,
    });
  }, [updateSettings]);

  const closeSettings = useCallback(() => {
    setIsClosing(true);
  }, []);

  const finishClosingSettings = useCallback(() => {
    if (isClosing) {
      hideSettings();
    }
  }, [hideSettings, isClosing]);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent): void => {
      const settingsMenu = settingsMenuRef.current;

      if (settingsMenu && event.target instanceof Node && !settingsMenu.contains(event.target)) {
        closeSettings();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [closeSettings]);

  useEffect(() => {
    if (!isClosing || !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    hideSettings();
  }, [hideSettings, isClosing]);

  return (
    <section
      aria-labelledby="settings-title"
      aria-modal="true"
      className={`settings${isClosing ? " settings--closing" : ""}`}
      onAnimationEnd={finishClosingSettings}
      ref={settingsMenuRef}
      role="dialog"
    >
      <button className="btn btn-clear btn-dark" type="button" aria-label="Close settings"
        onClick={closeSettings}
      >
        <XIcon size={16} />
      </button>
      <div className="settings-header">
        <h2 id="settings-title">Settings</h2>
      </div>
      <div aria-label="Settings categories" className="settings-tabs" role="tablist">
        <button
          aria-controls="timer-settings"
          aria-selected={activeTab === "timer"}
          className="settings-tab"
          id="timer-tab"
          onClick={() => setActiveTab("timer")}
          role="tab"
          type="button"
        >
          Timer
        </button>
        <button
          aria-controls="appearance-settings"
          aria-selected={activeTab === "appearance"}
          className="settings-tab"
          id="appearance-tab"
          onClick={() => setActiveTab("appearance")}
          role="tab"
          type="button"
        >
          Appearance
        </button>
        <button
          aria-controls="radio-settings"
          aria-selected={activeTab === "radio"}
          className="settings-tab"
          id="radio-tab"
          onClick={() => setActiveTab("radio")}
          role="tab"
          type="button"
        >
          Code Radio
        </button>
      </div>
      <div className="settings-content">
        {activeTab === "timer" && (
          <section aria-labelledby="timer-tab" id="timer-settings" role="tabpanel">
            <div>
              <label htmlFor="working-time">Work duration</label>
              <input id="working-time" type="range" min="1" max="120" value={settings.workingTime} onChange={updateWorkingTime} aria-describedby="working-time-value" style={getRangeStyle(settings.workingTime, 1, 120)} />
              <output id="working-time-value">Working time: {settings.workingTime} {settings.workingTime > 1 ? 'minutes' : 'minute'}</output>
            </div>
            <div>
              <label htmlFor="break-time">Break duration</label>
              <input id="break-time" type="range" min="1" max="120" value={settings.breakTime} onChange={updateBreakTime} aria-describedby="break-time-value" style={getRangeStyle(settings.breakTime, 1, 120)} />
              <output id="break-time-value">Break: {settings.breakTime} {settings.breakTime > 1 ? 'minutes' : 'minute'}</output>
            </div>
          </section>
        )}
        {activeTab === "appearance" && (
          <section aria-labelledby="appearance-tab" id="appearance-settings" role="tabpanel">
            <div>
              <label htmlFor="primary-color">Primary color</label>
              <input
                id="primary-color"
                type="color"
                value={settings.primaryColor}
                onChange={updatePrimaryColor}
              />
              <span id="color-contrast-help">Changing the primary color sets matching colors with at least 4.5:1 contrast. Custom colors must meet the same contrast requirement.</span>
              <label htmlFor="secondary-color">Secondary color</label>
              <input
                id="secondary-color"
                type="color"
                value={settings.secondaryColor}
                onChange={updateSecondaryColor}
                aria-describedby="color-contrast-help"
              />
              <label htmlFor="tertiary-color">Tertiary color</label>
              <input
                id="tertiary-color"
                type="color"
                value={settings.tertiaryColor}
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
          </section>
        )}
        {activeTab === "radio" && (
          <section aria-labelledby="radio-tab" id="radio-settings" role="tabpanel">
            <label className="settings-toggle">
              <input
                checked={settings.autoPlayRadioOnPomodoroStart}
                onChange={(event) => updateSettings({ autoPlayRadioOnPomodoroStart: event.target.checked })}
                type="checkbox"
              />
              <span>Play Code Radio when a Pomodoro starts</span>
            </label>
            <label className="settings-toggle">
              <input
                checked={settings.lowerRadioVolumeOnBreak}
                onChange={(event) => updateSettings({ lowerRadioVolumeOnBreak: event.target.checked })}
                type="checkbox"
              />
              <span>Lower Code Radio volume around alerts</span>
            </label>
          </section>
        )}
      </div>
    </section>
  );
};

export default Settings;
