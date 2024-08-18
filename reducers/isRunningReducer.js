const initialRunningState = {
  isRunning: false
};

const SET_RUNNING = "SET_RUNNING";

const isRunningReducer = (state = initialRunningState, action) => {
  switch (action.type) {
    case SET_RUNNING:
      return {
        ...state,
        isRunning: action.payload
      };
    default:
      return state;
  }
};

export default isRunningReducer;
