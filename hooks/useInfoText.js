import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setInfoText, setResetTimeoutsIds } from "../actions/counterActions";

const useInfoText = () => {
  const infoText = useSelector(state => state.infoText.infoText);
  const resetTimeoutsIds = useSelector(
    state => state.resetTimeoutsIds.resetTimeoutsIds
  );
  const dispatch = useDispatch();
  const [timeouts, setTimeouts] = useState([]);

  const clearTimeoutsAndMessage = () => {
    timeouts.forEach(timeoutId => clearTimeout(timeoutId));

    setTimeouts([]);
    dispatch(setResetTimeoutsIds([]));
    dispatch(setInfoText(""));
  };

  const setInfoTextWithTimeout = (text, timeout) => {
    clearTimeoutsAndMessage();

    dispatch(setInfoText(text));

    const timeoutId = setTimeout(() => {
      dispatch(setInfoText(""));
      setTimeouts(prevTimeouts => prevTimeouts.filter(id => id !== timeoutId));
      dispatch(
        setResetTimeoutsIds(prevTimeouts =>
          prevTimeouts.filter(id => id !== timeoutId)
        )
      );
    }, timeout);

    setTimeouts(prevTimeouts => [...prevTimeouts, timeoutId]);
    dispatch(setResetTimeoutsIds([...timeouts, timeoutId]));
  };

  useEffect(() => {
    return () => {
      clearTimeoutsAndMessage();
    };
  }, []);

  return {
    infoText,
    setInfoTextWithTimeout,
    clearTimeoutsAndMessage
  };
};

export default useInfoText;
