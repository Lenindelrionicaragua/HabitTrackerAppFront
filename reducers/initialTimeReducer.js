const initialTime = {
  initialTime: 0
};

const initialTimeReducer = (state = initialTime, action) => {
  switch (action.type) {
    case "SET_INITIAL_TIME":
      return {
        ...state,
        initialTime: action.payload
      };
    default:
      return state;
  }
};

export default initialTimeReducer;
