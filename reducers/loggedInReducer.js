const initialLoggedInState = {
  isLoggedIn: false
};

const loggedInReducer = (state = initialLoggedInState, action) => {
  switch (action.type) {
    case "SET_LOGGED_IN":
      return {
        ...state,
        isLoggedIn: action.payload
      };
    default:
      return state;
  }
};

export default loggedInReducer;
