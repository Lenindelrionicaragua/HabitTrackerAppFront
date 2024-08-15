import { combineReducers } from "redux";
import counterReducer from "../reducers/counterReducer";

const rootReducer = combineReducers({
  counter: counterReducer
});

export default rootReducer;
