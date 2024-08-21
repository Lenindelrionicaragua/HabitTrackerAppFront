import { useDispatch, useSelector } from "react-redux";
import { setCircleColor, setInnerCircleColor } from "../actions/counterActions";

const useUpdateCircleColors = () => {
  const dispatch = useDispatch();
  const circleColor = useSelector(state => state.circleColor);
  const innerCircleColor = useSelector(state => state.innerCircleColor);

  const updateColors = (newCircleColor, newInnerCircleColor) => {
    if (typeof newCircleColor !== "string" || !newCircleColor.trim()) {
      throw new Error("Invalid value for circleColor");
    }
    if (
      typeof newInnerCircleColor !== "string" ||
      !newInnerCircleColor.trim()
    ) {
      throw new Error("Invalid value for innerCircleColor");
    }

    dispatch(setCircleColor(newCircleColor));
    dispatch(setInnerCircleColor(newInnerCircleColor));
  };

  return { circleColor, innerCircleColor, updateColors };
};

export default useUpdateCircleColors;
