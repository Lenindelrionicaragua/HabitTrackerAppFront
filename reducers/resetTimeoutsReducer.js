const initialResetTimeouts = {
  resetTimeouts: []
};

const SET_RESET_TIMEOUTS = "SET_RESET_TIMEOUTS";

const resetTimeoutsReducer = (state = initialResetTimeouts, action) => {
  switch (action.type) {
    case SET_RESET_TIMEOUTS:
      return {
        ...state,
        resetTimeouts: action.payload
      };
    default:
      return state;
  }
};

export default resetTimeoutsReducer;
