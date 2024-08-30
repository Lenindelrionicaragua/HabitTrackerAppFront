const initialRemainingTimeState = {
  remainingTime: 0
};

const SET_REMAINING_TIME = "SET_REMAINING_TIME";

const remainingTimeReducer = (state = initialRemainingTimeState, action) => {
  switch (action.type) {
    case SET_REMAINING_TIME:
      return {
        ...state,
        remainingTime: action.payload
      };
    default:
      return state;
  }
};

export default remainingTimeReducer;
