import { OPEN_SETTINGS, CLOSE_SETTINGS, START_POMODORO, STOP_POMODORO, RESET_POMODORO, START_BREAK, STOP_BREAK, SAVE_SETTINGS, LOAD_SETTINGS } from './constants';

export const saveSettings = (settings) => {
  localStorage.setItem('@pomodoro:settings', JSON.stringify(settings));
  return {
    type: SAVE_SETTINGS,
    payload: { settings }
  }
}

export const loadSettings = () => {
  const settings = JSON.parse(localStorage.getItem('@pomodoro:settings'));
  return {
    type: LOAD_SETTINGS,
    payload: { settings }
  }
}

// export const OPEN_SETTINGS = 'OPEN_SETTINGS';
export const openSettings = () => {
  return {
    type: OPEN_SETTINGS,
    payload: { showSettings: true }
  }
}
// export const CLOSE_SETTINGS = 'CLOSE_SETTINGS';
export const closeSettings = () => {
  return {
    type: CLOSE_SETTINGS,
    payload: { showSettings: false }
  }
}
// export const START_POMODORO = 'START_POMODORO';
export const startPomodoro = () => {
  return {
    type: START_POMODORO,
    payload: { pomodoroStarted: true }
  }
}
// export const STOP_POMODORO = 'STOP_POMODORO';
export const stopPomodoro = () => {
  return {
    type: STOP_POMODORO,
    payload: { pomodoroStarted: false }
  }
}
// export const RESET_POMODORO = 'RESET_POMODORO';
export const resetPomodoro = () => {
  return {
    type: RESET_POMODORO
  }
}
// export const START_BREAK = 'START_BREAK';
export const startBreak = () => {
  return {
    type: START_BREAK,
    payload: { breakStarted: true }
  }
}
// export const STOP_BREAK = 'STOP_BREAK';
export const stopBreak = () => {
  return {
    type: STOP_BREAK,
    payload: { breakStarted: false }
  }
}