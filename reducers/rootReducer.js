import { combineReducers } from "redux";
import initialTimeReducer from "./initialTimeReducer";
import remainingTimeReducer from "./remainingTimeReducer";
import elapsedTimeReducer from "./elapsedTimeReducer";
import timeCompletedReducer from "./timeCompletedReducer";
import runningReducer from "./runningReducer";

const rootReducer = combineReducers({
  initialTime: initialTimeReducer,
  remainingTime: remainingTimeReducer,
  elapsedTime: elapsedTimeReducer,
  timeCompleted: timeCompletedReducer,
  running: runningReducer
});

export default rootReducer;
