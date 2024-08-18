const initialElapsedTime = {
  elapsedTime: 0
};

const SET_ELAPSED_TIME = "SET_ELAPSED_TIME";

const elapsedTimeReducer = (state = initialElapsedTime, action) => {
  switch (action.type) {
    case SET_ELAPSED_TIME:
      return {
        ...state,
        elapsedTime: action.payload
      };
    default:
      return state;
  }
};

export default elapsedTimeReducer;
