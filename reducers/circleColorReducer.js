import { Colors } from "../styles/AppStyles";

const { skyBlue } = Colors;

const initialCircleColor = {
  circleColor: skyBlue
};

const SET_CIRCLE_COLOR = "SET_CIRCLE_COLOR";

const circleColorReducer = (state = initialCircleColor, action) => {
  switch (action.type) {
    case SET_CIRCLE_COLOR:
      return {
        ...state,
        circleColor: action.payload || state.circleColor
      };
    default:
      return state;
  }
};

export default circleColorReducer;
