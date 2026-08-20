import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_SETTINGS } from "../constants/pomodoro";
import type { PomodoroSettings, PomodoroState } from "../types/pomodoro";

export type { PomodoroSettings, PomodoroState } from "../types/pomodoro";

const initialState: PomodoroState = {
  showSettings: false,
  settings: DEFAULT_SETTINGS,
  pomodoroStarted: false,
  breakTime: false,
};

const pomodoroSlice = createSlice({
  name: "pomodoro",
  initialState,
  reducers: {
    saveSettings: (state, action: PayloadAction<PomodoroSettings>) => {
      state.settings = action.payload;
    },
    loadSettings: (state, action: PayloadAction<PomodoroSettings>) => {
      state.settings = action.payload;
    },
    openSettings: (state) => {
      state.showSettings = true;
    },
    closeSettings: (state) => {
      state.showSettings = false;
    },
    startPomodoro: (state) => {
      state.pomodoroStarted = true;
    },
    stopPomodoro: (state) => {
      state.pomodoroStarted = false;
    },
    resetPomodoro: (state) => {
      state.breakTime = false;
    },
    startBreak: (state) => {
      state.breakTime = true;
    },
    stopBreak: (state) => {
      state.breakTime = false;
    },
  },
});

export const pomodoroActions = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
