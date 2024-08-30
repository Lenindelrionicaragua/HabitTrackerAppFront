import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setInfoText, setResetTimeoutsIds } from "../actions/counterActions";

const useInfoText = () => {
  const infoText = useSelector(state => state.infoText.infoText);

  const dispatch = useDispatch();

  const clearTimeoutsAndMessage = () => {
    dispatch(setResetTimeoutsIds([]));
    dispatch(setInfoText(""));
  };

  const updateInfoText = text => {
    dispatch(setInfoText(text));
  };

  useEffect(() => {
    return () => {
      clearTimeoutsAndMessage();
    };
  }, []);

  return {
    infoText,
    updateInfoText,
    clearTimeoutsAndMessage
  };
};

export default useInfoText;
