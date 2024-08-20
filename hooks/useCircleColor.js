import { useDispatch, useSelector } from "react-redux";
import { setCircleColor, setInnerCircleColor } from "../actions/counterActions";

const useCircleColors = () => {
  const dispatch = useDispatch();
  const circleColor = useSelector(state => state.circleColor);
  const innerCircleColor = useSelector(state => state.innerCircleColor);

  const updateColors = (newCircleColor, newInnerCircleColor) => {
    dispatch(setCircleColor(newCircleColor));
    dispatch(setInnerCircleColor(newInnerCircleColor));
  };

  return { circleColor, innerCircleColor, updateColors };
};

export default useCircleColors;
