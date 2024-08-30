const initialButtonsDisabled = {
  buttonsDisabled: false
};

const SET_BUTTONS_DISABLED = "SET_BUTTONS_DISABLED";

const buttonsDisabledReducer = (state = initialButtonsDisabled, action) => {
  switch (action.type) {
    case SET_BUTTONS_DISABLED:
      return {
        ...state,
        buttonsDisabled: action.payload
      };
    default:
      return state;
  }
};

export default buttonsDisabledReducer;
