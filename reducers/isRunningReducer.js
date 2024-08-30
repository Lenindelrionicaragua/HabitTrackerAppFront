const initialIsRunningState = {
  isRunning: false
};

const SET_IS_RUNNING = "SET_IS_RUNNING";

const isRunningReducer = (state = initialIsRunningState, action) => {
  switch (action.type) {
    case SET_IS_RUNNING:
      return {
        ...state,
        isRunning: action.payload
      };
    default:
      return state;
  }
};

export default isRunningReducer;
