const elapsedTime = {
  elapsedTime: 0
};

const elapsedTimeReducer = (state = elapsedTime, action) => {
  switch (action.type) {
    case "SET_ELAPSED_TIME":
      return {
        ...state,
        elapsedTime: action.payload
      };
    default:
      return state;
  }
};

export default elapsedTimeReducer;
