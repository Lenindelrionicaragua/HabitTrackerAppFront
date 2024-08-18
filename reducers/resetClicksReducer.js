const initialResetClicks = {
  resetClicks: 0
};

const resetClicksReducer = (state = initialResetClicks, action) => {
  switch (action.type) {
    case "SET_RESET_CLICKS":
      return {
        ...state,
        resetClicks: action.payload
      };
    default:
      return state;
  }
};
