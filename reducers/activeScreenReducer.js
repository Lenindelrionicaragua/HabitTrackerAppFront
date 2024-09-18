import { logInfo } from "../util/logging";

const initialActiveScreenState = {
  activeScreen: "LinkVerificationScreen"
};

const activeScreenReducer = (state = initialActiveScreenState, action) => {
  switch (action.type) {
    case "SET_ACTIVE_SCREEN":
      logInfo(`Screen changed to: ${action.payload}`);
      return {
        ...state,
        activeScreen: action.payload
      };
    default:
      return state;
  }
};

export default activeScreenReducer;
