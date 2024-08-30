const initialFirstRun = {
  firstRun: 0
};

const SET_FIRST_RUN = "SET_FIRST_RUN";

const setFirstRunReducer = (state = initialFirstRun, action) => {
  switch (action.type) {
    case SET_FIRST_RUN:
      return {
        ...state,
        firstRun: action.payload
      };
    default:
      return state;
  }
};

export default setFirstRunReducer;
