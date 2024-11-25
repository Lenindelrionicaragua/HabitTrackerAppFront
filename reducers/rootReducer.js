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
import innerCircleColorReducer from "./innerCircleColorReducer";
import firstRunReducer from "./firstRunReducer";
import habitCategoryIndexReducer from "./habitCategoryIndexReducer";
import habitCategoriesReducer from "./habitCategoriesReducer";
import monthlyStatsReducer from "./monthlyStatsReducer";
import saveTimeButtonLabelReducer from "./saveTimeButtonLabelReducer";
import buttonsDisabledReducer from "./buttonsDisabledReducer";

//navigation
import activeScreenReducer from "./activeScreenReducer";

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
  circleColor: circleColorReducer,
  innerCircleColor: innerCircleColorReducer,
  firstRun: firstRunReducer,
  saveTimeButtonLabel: saveTimeButtonLabelReducer,
  buttonsDisabled: buttonsDisabledReducer,
  habitCategoryIndex: habitCategoryIndexReducer,
  habitCategories: habitCategoriesReducer,
  monthlyStats: monthlyStatsReducer,
  activeScreen: activeScreenReducer
});

export default rootReducer;
