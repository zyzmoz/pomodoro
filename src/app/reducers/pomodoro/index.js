import {  OPEN_SETTINGS, CLOSE_SETTINGS, START_POMODORO, STOP_POMODORO, RESET_POMODORO, START_BREAK, STOP_BREAK, SAVE_SETTINGS, LOAD_SETTINGS } from '../../actions/constants';
import { createReducer } from '../createReducer';

const initialState = {};

const saveSettings = (state, payload) => {
  return {...state, settings: payload.settings} 
}

const loadSettings = (state, payload) => {
  return {...state, settings: payload.settings} 
}

const openSettings = (state, payload) => {
  return {...state, showSettings: payload.showSettings} 
}
const closeSettings = (state, payload) => {
  return {...state, showSettings: payload.showSettings} 
}

const startPomodoro = (state, payload) => {
  return {...state, pomodoroStarted: payload.pomodoroStarted} 
}

const stopPomodoro = (state, payload) => {
  return {...state, pomodoroStarted: payload.pomodoroStarted} 
}

const resetPomodoro = (state, payload) => {
  return {...state}

}

const startBreak = (state, payload) => {
  return {...state, breakTime: true}

}

const stopBreak = (state, payload) => {
  return {...state, breakTime: false}
}

export default createReducer(initialState, {
  [SAVE_SETTINGS]: saveSettings,
  [LOAD_SETTINGS]: loadSettings,
  [OPEN_SETTINGS]: openSettings,
  [CLOSE_SETTINGS]: closeSettings,
  [START_POMODORO]: startPomodoro,
  [STOP_POMODORO]: stopPomodoro,
  [RESET_POMODORO]: resetPomodoro,
  [START_BREAK]: startBreak,
  [STOP_BREAK]: stopBreak
});