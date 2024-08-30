const initialHasStarted = {
  hasStarted: false
};

const SET_HAS_STARTED = "SET_HAS_STARTED";

const hasStartedReducer = (state = initialHasStarted, action) => {
  switch (action.type) {
    case SET_HAS_STARTED:
      return {
        ...state,
        hasStarted: action.payload
      };
    default:
      return state;
  }
};

export default hasStartedReducer;
