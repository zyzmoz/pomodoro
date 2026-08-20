import { useEffect, useState } from "react";
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

const App = () => {
  const dispatch = useAppDispatch();
  const { showSettings, settings, breakTime, pomodoroStarted } = useAppSelector(
    (state) => state.pomodoro
  );
  let timer = 0;
  let minutes: number | string;
  let seconds: number | string;
  const audio = new Audio(bell);

  useEffect(() => {
    requestNotificationPermission();
    dispatch(pomodoroActions.loadSettings(loadSettings()));
  }, [dispatch]);

  const [display, setDisplay] = useState("");
  const [clock, setClock] = useState<number | null>(null);

  const countDown = () => {
    let onBreak = false;
    if (timer != 0)
      setClock(
        window.setInterval(() => {
          minutes = Math.floor(timer / 60);
          seconds = Math.floor(timer % 60);
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          setDisplay(minutes + ":" + seconds);

          if (--timer < 0) {
            if (!onBreak) {
              onBreak = true;
              audio.currentTime = 0;
              audio.play();
              showNotification("Break time");
              dispatch(pomodoroActions.startBreak());
              timer = settings.breakTime * 60;
            } else {
              onBreak = false;
              audio.currentTime = 0;
              audio.play();
              showNotification("It's time to work");
              dispatch(pomodoroActions.stopBreak());
              timer = settings.workingTime * 60;
            }
          }
        }, 1000)
      );
  };

  const start = () => {
    timer = settings.workingTime * 60;
    dispatch(pomodoroActions.startPomodoro());
    if (!clock) countDown();
  };

  const stop = () => {
    dispatch(pomodoroActions.stopPomodoro());
    timer = 0;
    if (clock !== null) {
      window.clearInterval(clock);
    }
    setClock(null);
    setDisplay("");
  };

  const reset = () => {
    dispatch(pomodoroActions.resetPomodoro());
    stop();
    start();
  };

  const handleSaveSettings = (newSettings: PomodoroSettings) => {
    saveSettings(newSettings);
    dispatch(pomodoroActions.saveSettings(newSettings));
    dispatch(pomodoroActions.closeSettings());
  };

  return (
    <div className="app-main">
      <div className="app-header">
        <button className="btn" onClick={() => dispatch(pomodoroActions.openSettings())}>
          <GrabberIcon size={16} />
        </button>
      </div>
      {showSettings && (
        <Settings
          hideSettings={() => dispatch(pomodoroActions.closeSettings())}
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
    </div>
  );
};

export default App;
