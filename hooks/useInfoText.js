import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setInfoText, setResetTimeoutsIds } from "../actions/counterActions";
import { clearMessagesAndTimeouts } from "../util/messageAndTimeoutHandlers";

const useInfoText = () => {
  const infoText = useSelector(state => state.infoText.infoText);
  const resetTimeoutsIds = useSelector(
    state => state.resetTimeoutsIds.resetTimeoutsIds
  );
  const dispatch = useDispatch();

  const clearPreviousTimeouts = () => {
    console.log("Clearing previous timeouts");
    clearMessagesAndTimeouts(
      resetTimeoutsIds,
      ids => dispatch(setResetTimeoutsIds(ids)),
      msg => dispatch(setInfoText(msg))
    );
  };

  const setInfoTextWithTimeout = (text, timeout) => {
    console.log("Setting infoText:", text);
    dispatch(setInfoText(text));

    const timeoutId = setTimeout(() => {
      console.log("Clearing infoText after timeout:", timeout);
      dispatch(setInfoText(""));
    }, timeout);

    dispatch(setResetTimeoutsIds(prevTimeouts => [...prevTimeouts, timeoutId]));
  };

  useEffect(() => {
    return () => {
      clearPreviousTimeouts();
    };
  }, [infoText, dispatch]);

  return {
    infoText,
    setInfoTextWithTimeout,
    clearPreviousTimeouts
  };
};

export default useInfoText;
