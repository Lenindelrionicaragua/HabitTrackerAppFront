import { Colors } from "../styles/AppStyles";

const { white } = Colors;

const initialInnerCircleColor = {
  innerCircleColor: white
};

const SET_INNER_CIRCLE_COLOR = "SET_INNER_CIRCLE_COLOR";

const innerCircleColorReducer = (state = initialInnerCircleColor, action) => {
  switch (action.type) {
    case SET_INNER_CIRCLE_COLOR:
      return {
        ...state,
        innerCircleColor: action.payload || state.innerCircleColor
      };
    default:
      return state;
  }
};

export default innerCircleColorReducer;
