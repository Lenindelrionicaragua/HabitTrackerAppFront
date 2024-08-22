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

  const setInfoTextWithTimeout = (text, timeout) => {
    dispatch(setResetTimeoutsIds([]));
    dispatch(setInfoText(""));
    dispatch(setInfoText(text));

    const timeoutId = setTimeout(() => {
      dispatch(setInfoText(""));
    }, timeout);

    dispatch(setResetTimeoutsIds(prevTimeouts => [...prevTimeouts, timeoutId]));
  };

  useEffect(() => {
    return () => {
      clearTimeoutsAndMessage();
    };
  }, [dispatch]);

  return {
    infoText,
    setInfoTextWithTimeout,
    clearTimeoutsAndMessage
  };
};

export default useInfoText;
