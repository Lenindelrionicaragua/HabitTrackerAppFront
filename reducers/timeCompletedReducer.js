const initialTimeCompletedState = {
  timeCompleted: false
};

const SET_TIME_COMPLETED = "SET_TIME_COMPLETED";

const timeCompletedReducer = (state = initialTimeCompletedState, action) => {
  switch (action.type) {
    case SET_TIME_COMPLETED:
      return {
        ...state,
        timeCompleted: action.payload
      };
    default:
      return state;
  }
};

export default timeCompletedReducer;
