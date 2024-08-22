const initialResetTimeoutsIds = {
  resetTimeoutsIds: [1, 2, 3]
};

const SET_RESET_TIMEOUTS_IDS = "SET_RESET_TIMEOUTS_IDS";

const resetTimeoutsIdsReducer = (state = initialResetTimeoutsIds, action) => {
  switch (action.type) {
    case SET_RESET_TIMEOUTS_IDS:
      return {
        ...state,
        resetTimeoutsIds: action.payload
      };
    default:
      return state;
  }
};

export default resetTimeoutsIdsReducer;
