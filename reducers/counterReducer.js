const initialState = {
  time: 0
};

const SET_TIME = "SET_TIME";

const counterReducer = (state = initialState, action) => {
  console.log("Reducer called with action:", action);
  console.log("Previous state:", state);
  switch (action.type) {
    case SET_TIME:
      return {
        ...state,
        time: action.payload
      };
    default:
      return state;
  }
};

export default counterReducer;
