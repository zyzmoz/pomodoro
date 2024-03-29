import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  openSettings,
  closeSettings,
  saveSettings,
  loadSettings,
  startPomodoro,
  stopPomodoro,
  startBreak,
  stopBreak,
  resetPomodoro,
} from "./actions";
import "../assets/css/master.css";
import Octicon, { Grabber } from "@githubprimer/octicons-react";
import Clock from "./components/Clock/Clock";
import Settings from "./components/Settings/Settings";
import Controls from "./components/Controls/Controls";
import bell from "../assets/sounds/bell.wav";

const mapState = (state) => ({
  pomodoro: state.pomodoro,
});

const actions = {
  openSettings,
  closeSettings,
  saveSettings,
  loadSettings,
  startPomodoro,
  stopPomodoro,
  startBreak,
  stopBreak,
  resetPomodoro,
};

const App = (props) => {
  const { showSettings, settings, breakTime, pomodoroStarted } = props.pomodoro;
  let timer = 0,
    minutes,
    seconds;
  const audio = new Audio(bell);

  useEffect(() => {
    props.loadSettings();
  }, []);

  const [display, setDisplay] = useState("");
  const [clock, setClock] = useState(null);

  const countDown = () => {
    let onBreak = false;
    if (timer != 0)
      setClock(
        setInterval(() => {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          setDisplay(minutes + ":" + seconds);

          if (--timer < 0) {
            if (!onBreak) {
              onBreak = true;
              audio.currentTime = 0;
              audio.play();
              props.startBreak();
              timer = settings.breakTime * 60;
            } else {
              onBreak = false;
              audio.currentTime = 0;
              audio.play();
              props.stopBreak();
              timer = settings.workingTime * 60;
            }
          }
        }, 1000)
      );
  };

  const start = () => {
    timer = settings.workingTime * 60;
    props.startPomodoro();
    if (!clock) countDown();
  };

  const stop = () => {
    props.stopPomodoro();
    timer = 0;
    minutes = null;
    seconds = null;
    clearInterval(clock);
    setClock(null);
    setDisplay("");
  };

  const reset = () => {
    props.resetPomodoro();
    stop();
    start();
  };

  const saveSettings = (settings) => {
    props.saveSettings(settings);
    props.closeSettings();
  };

  return (
    <div className="app-main">
      <div className="app-header">
        <button className="btn" onClick={props.openSettings}>
          <Octicon icon={Grabber} size="medium" />
        </button>
      </div>
      {showSettings && (
        <Settings
          hideSettings={props.closeSettings}
          saveSettings={saveSettings}
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

export default connect(mapState, actions)(App);