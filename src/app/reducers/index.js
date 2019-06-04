import { combineReducers } from 'redux';
import pomodoro from './pomodoro';

const reducers = combineReducers({
  state: (state= {}) => state,
  pomodoro
});

export default reducers;