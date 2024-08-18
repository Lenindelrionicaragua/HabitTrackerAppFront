import { combineReducers } from "redux";
import initialTimeReducer from "./initialTimeReducer";
import remainingTimeReducer from "./remainingTimeReducer";
import elapsedTimeReducer from "./elapsedTimeReducer";
import timeCompletedReducer from "./timeCompletedReducer";
import isRunningReducer from "./isRunningReducer";
import resetButtonLabelReducer from "./resetButtonLabelReducer";
import infoTextReducer from "./infoTextReducer";

const rootReducer = combineReducers({
  initialTime: initialTimeReducer,
  remainingTime: remainingTimeReducer,
  elapsedTime: elapsedTimeReducer,
  timeCompleted: timeCompletedReducer,
  isRunning: isRunningReducer,
  resetButtonLabel: resetButtonLabelReducer,
  infoText: infoTextReducer
});

export default rootReducer;
