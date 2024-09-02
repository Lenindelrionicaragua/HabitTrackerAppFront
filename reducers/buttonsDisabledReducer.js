const initialButtonsDisabled = {
  buttonsDisabled: false
};

const SET_BUTTONS_DISABLED = "SET_BUTTONS_DISABLED";

const buttonsDisabledReducer = (state = initialButtonsDisabled, action) => {
  console.log("Action received:", action);
  switch (action.type) {
    case SET_BUTTONS_DISABLED:
      console.log("SET_BUTTONS_DISABLED payload:", action.payload);
      return {
        ...state,
        buttonsDisabled: action.payload
      };
    default:
      return state;
  }
};

export default buttonsDisabledReducer;
