const initialInfoText = {
  infoText: "Choose your task\nand adjust the time\n to start the tracker."
};

const SET_INFO_TEXT = "SET_INFO_TEXT";

const infoTextReducer = (state = initialInfoText, action) => {
  switch (action.type) {
    case SET_INFO_TEXT:
      return {
        ...state,
        infoText: action.payload
      };
    default:
      return state;
  }
};

export default infoTextReducer;
