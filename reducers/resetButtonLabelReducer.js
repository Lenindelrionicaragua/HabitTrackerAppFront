const initialResetButtonLabel = {
  label: "RESET"
};

const resetButtonLabelReducer = (state = resetButtonLabel, action) => {
  switch (action.type) {
    case "SET_RESET_BUTTON_LABEL":
      return {
        ...state,
        elapsedTime: action.payload
      };
    default:
      return state;
  }
};

export default resetButtonLabelReducer;
