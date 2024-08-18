const initialResetTimeouts = {
  resetTimeouts: []
};

const resetTimeoutsReducer = (state = initialResetTimeouts, action) => {
  switch (action.type) {
    case "SET_RESET_TIMEOUTS":
      return {
        ...state,
        resetTimeouts: action.payload
      };
    default:
      return state;
  }
};

export default resetTimeoutsReducer;
