const initialSaveTimeButtonLabel = {
  saveTimeButtonLabel: "SAVE TIME"
};

const SET_SAVE_TIME_BUTTON_LABEL = "SET_SAVE_TIME_BUTTON_LABEL";

const saveTimeButtonLabelReducer = (
  state = initialSaveTimeButtonLabel,
  action
) => {
  switch (action.type) {
    case SET_SAVE_TIME_BUTTON_LABEL:
      return {
        ...state,
        saveTimeButtonLabel: action.payload
      };
    default:
      return state;
  }
};

export default saveTimeButtonLabelReducer;
