const initialTimeState = {
  remainingTime: 0
};

const SET_INITIAL_TIME = "SET_INITIAL_TIME";

const initialTimeReducer = (state = initialTimeState, action) => {
  switch (action.type) {
    case SET_INITIAL_TIME:
      return {
        ...state,
        initialTime: action.payload
      };
    default:
      return state;
  }
};

export default initialTimeReducer;
