import { combineReducers } from "redux";
import initialTimeReducer from "./initialTimeReducer";
import remainingTimeReducer from "./remainingTimeReducer";
import elapsedTimeReducer from "./elapsedTimeReducer";
import timeCompletedReducer from "./timeCompletedReducer";
import isRunningReducer from "./isRunningReducer";
import resetButtonLabelReducer from "./resetButtonLabelReducer";
import infoTextReducer from "./infoTextReducer";
import resetClicksReducer from "./resetClicksReducer";
import resetTimeoutsIdsReducer from "./resetTimeoutsIdsReducer";
import hasStartedReducer from "./hasStartedReducer";
import circleColorReducer from "./circleColorReducer";

const rootReducer = combineReducers({
  initialTime: initialTimeReducer,
  remainingTime: remainingTimeReducer,
  elapsedTime: elapsedTimeReducer,
  timeCompleted: timeCompletedReducer,
  isRunning: isRunningReducer,
  resetButtonLabel: resetButtonLabelReducer,
  infoText: infoTextReducer,
  resetClicks: resetClicksReducer,
  resetTimeoutsIds: resetTimeoutsIdsReducer,
  hasStarted: hasStartedReducer,
  circleColor: circleColorReducer
});

export default rootReducer;
