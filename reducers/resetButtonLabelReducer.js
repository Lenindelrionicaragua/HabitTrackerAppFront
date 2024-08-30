const initialResetButtonLabel = {
  resetButtonLabel: "RESET"
};

const SET_RESET_BUTTON_LABEL = "SET_RESET_BUTTON_LABEL";

const resetButtonLabelReducer = (state = initialResetButtonLabel, action) => {
  switch (action.type) {
    case SET_RESET_BUTTON_LABEL:
      return {
        ...state,
        resetButtonLabel: action.payload
      };
    default:
      return state;
  }
};

export default resetButtonLabelReducer;
