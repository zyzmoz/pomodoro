import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { getThemeColors } from "./helpers/colors";
import { showNotification, requestNotificationPermission } from "./helpers/notifications";
import { loadSettings, saveSettings } from "./helpers/settings";
import { useAppDispatch, useAppSelector } from "./store";
import { pomodoroActions } from "./store/pomodoroSlice";
import type { PomodoroSettings } from "./types/pomodoro";
import "./assets/css/master.css";
import { GrabberIcon } from "@primer/octicons-react";
import Clock from "./components/Clock/Clock";
import Settings from "./components/Settings/Settings";
import Controls from "./components/Controls/Controls";

const bell = new URL("./assets/sounds/bell.wav", import.meta.url).href;

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
};

const App = () => {
  const dispatch = useAppDispatch();
  const { showSettings, settings, breakTime, pomodoroStarted } = useAppSelector(
    (state) => state.pomodoro
  );
  const timerRef = useRef(0);
  const isBreakRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (audioRef.current === null) {
    audioRef.current = new Audio(bell);
  }

  useEffect(() => {
    requestNotificationPermission();
    dispatch(pomodoroActions.loadSettings(loadSettings()));
  }, [dispatch]);

  const [display, setDisplay] = useState("");
  const themeColors = useMemo(
    () =>
      getThemeColors(
        settings.primaryColor,
        settings.secondaryColor,
        settings.tertiaryColor
      ),
    [settings.primaryColor, settings.secondaryColor, settings.tertiaryColor]
  );
  const themeStyle = {
    "--color-primary": themeColors.primary,
    "--color-secondary": themeColors.secondary,
    "--color-tertiary": themeColors.tertiary,
  } as CSSProperties;

  const playBell = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, []);

  const onTimerComplete = useCallback(() => {
    isBreakRef.current = !isBreakRef.current;

    if (isBreakRef.current) {
      playBell();
      showNotification("Break time");
      dispatch(pomodoroActions.startBreak());
      timerRef.current = settings.breakTime * 60;
      return;
    }

    playBell();
    showNotification("It's time to work");
    dispatch(pomodoroActions.stopBreak());
    timerRef.current = settings.workingTime * 60;
  }, [dispatch, playBell, settings.breakTime, settings.workingTime]);

  const onTimerTick = useCallback(() => {
    setDisplay(formatTime(timerRef.current));
    timerRef.current -= 1;

    if (timerRef.current < 0) {
      onTimerComplete();
    }
  }, [onTimerComplete]);

  useEffect(() => {
    if (!pomodoroStarted) {
      return;
    }

    const intervalId = window.setInterval(() => {
      onTimerTick();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [onTimerTick, pomodoroStarted]);

  const start = useCallback(() => {
    isBreakRef.current = false;
    timerRef.current = settings.workingTime * 60;
    setDisplay(formatTime(timerRef.current));
    dispatch(pomodoroActions.startPomodoro());
  }, [dispatch, settings.workingTime]);

  const stop = useCallback(() => {
    dispatch(pomodoroActions.stopPomodoro());
    timerRef.current = 0;
    isBreakRef.current = false;
    setDisplay("");
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(pomodoroActions.resetPomodoro());
    isBreakRef.current = false;
    timerRef.current = settings.workingTime * 60;
    setDisplay(formatTime(timerRef.current));
    dispatch(pomodoroActions.startPomodoro());
  }, [dispatch, settings.workingTime]);

  const handleSaveSettings = useCallback((newSettings: PomodoroSettings) => {
    saveSettings(newSettings);
    dispatch(pomodoroActions.saveSettings(newSettings));
    dispatch(pomodoroActions.closeSettings());
  }, [dispatch]);

  const openSettings = useCallback(() => {
    dispatch(pomodoroActions.openSettings());
  }, [dispatch]);

  const closeSettings = useCallback(() => {
    dispatch(pomodoroActions.closeSettings());
  }, [dispatch]);

  return (
    <main className="app-main" style={themeStyle}>
      <div className="app-header">
        <button className="btn" type="button" aria-label="Open settings" onClick={openSettings}>
          <GrabberIcon size={16} />
        </button>
      </div>
      {showSettings && (
        <Settings
          hideSettings={closeSettings}
          saveSettings={handleSaveSettings}
          {...settings}
        />
      )}
      <div className="app-content">
        <div></div>
        <Clock
          display={display}
          onBreak={breakTime}
          pomodoroStarted={pomodoroStarted}
          startWorking={start}
        />
        <Controls
          startWorking={start}
          stopWorking={stop}
          pomodoroStarted={pomodoroStarted}
          reset={reset}
        />
      </div>
    </main>
  );
};

export default App;
