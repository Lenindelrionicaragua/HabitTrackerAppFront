import { combineReducers } from "redux";
import initialTimeReducer from "./initialTimeReducer";
import remainingTimeReducer from "./remainingTimeReducer";
import elapsedTimeReducer from "./elapsedTimeReducer";

const rootReducer = combineReducers({
  initialTime: initialTimeReducer,
  remainingTime: remainingTimeReducer,
  elapsedTime: elapsedTimeReducer
});

export default rootReducer;
