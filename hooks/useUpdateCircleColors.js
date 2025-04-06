import { useDispatch, useSelector } from "react-redux";
import { setCircleColor, setInnerCircleColor } from "../actions/counterActions";
import { logError } from "../util/logging";

const useUpdateCircleColors = () => {
  const dispatch = useDispatch();

  const circleColor = useSelector(state => state.circleColor.circleColor);
  const innerCircleColor = useSelector(
    state => state.innerCircleColor.innerCircleColor
  );

  const isValidColor = color => {
    return typeof color === "string" && color.trim() !== "";
  };

  const updateColors = (newCircleColor, newInnerCircleColor) => {
    if (!isValidColor(newCircleColor)) {
      const error = new Error(
        `Invalid value for circleColor: ${newCircleColor}`
      );
      logError(error);
      throw error;
    }
    if (!isValidColor(newInnerCircleColor)) {
      const error = new Error(
        `Invalid value for innerCircleColor: ${newInnerCircleColor}`
      );
      logError(error);
      throw error;
    }

    dispatch(setCircleColor(newCircleColor));
    dispatch(setInnerCircleColor(newInnerCircleColor));
  };

  return { circleColor, innerCircleColor, updateColors };
};

export default useUpdateCircleColors;
