const initialRunningState = {
  running: false
};

const SET_RUNNING = "SET_RUNNING";

const runningReducer = (state = initialRunningState, action) => {
  switch (action.type) {
    case SET_RUNNING:
      return {
        ...state,
        running: action.payload
      };
    default:
      return state;
  }
};

export default runningReducer;
