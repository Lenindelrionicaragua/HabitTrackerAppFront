const initialInitialTime = {
  initialTime: 0
};

const initialTimeReducer = (state = initialInitialTime, action) => {
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
