import { useSelector, useDispatch } from "react-redux";
import {
  setResetButtonLabel,
  setInfoText,
  setResetClicks,
  setResetTimeouts,
  setHasStarted,
  setIsRunning
} from "../actions/counterActions";
import { clearInfoTextAfter } from "../util/messageAndTimeoutHandlers";

function useResetStopwatch() {
  const resetButtonLabel = useSelector(
    state => state.resetButtonLabel.resetButtonLabel
  );
  const infoText = useSelector(state => state.infoText.infoText);
  const resetClicks = useSelector(state => state.resetClicks.resetClicks);
  const resetTimeouts = useSelector(state => state.resetTimeouts);
  const hasStarted = useSelector(state => state.hasStarted.hasStarted);
  const remainingTime = useSelector(state => state.remainingTime);

  const dispatch = useDispatch();

  const updateButtonAndInfoText = (label, infoText, cancelAfter) => {
    dispatch(setResetButtonLabel(label));
    dispatch(setInfoText(infoText));

    if (cancelAfter) {
      const timeoutId = setTimeout(() => {
        dispatch(setResetButtonLabel("RESET"));
        dispatch(setResetClicks(0));
        dispatch(setInfoText("Reset cancelled."));
      }, cancelAfter);
      dispatch(setResetTimeouts(prevTimeouts => [...prevTimeouts, timeoutId]));
    }
  };

  const handleResetClicksZero = () => {
    if (remainingTime === 0) {
      updateButtonAndInfoText(
        "RESET",
        "The timer is already at zero. Do you want to reset it?",
        10000
      );
    } else {
      updateButtonAndInfoText(
        "CONFIRM RESET",
        "Are you sure you want to reset the stopwatch?",
        10000
      );
      dispatch(setIsRunning(false));
    }
    clearInfoTextAfter(
      12000,
      text => dispatch(setInfoText(text)),
      timeouts => dispatch(setResetTimeouts(timeouts)),
      resetTimeouts
    );
  };

  const handleResetClicksOne = () => {
    if (remainingTime !== 0) {
      updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
      clearInfoTextAfter(
        2000,
        text => dispatch(setInfoText(text)),
        timeouts => dispatch(setResetTimeouts(timeouts)),
        resetTimeouts
      );
    }
  };

  const handleResetClicksTwoOrMore = () => {
    if (remainingTime === 0) {
      dispatch(setResetClicks(0));
      dispatch(setHasStarted(false));
      updateButtonAndInfoText("RESET", "Stopwatch is already reset.", 10000);
    } else {
      updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
    }
    clearInfoTextAfter(
      2000,
      text => dispatch(setInfoText(text)),
      timeouts => dispatch(setResetTimeouts(timeouts)),
      resetTimeouts
    );
  };

  return {
    resetButtonLabel,
    setResetButtonLabel: label => dispatch(setResetButtonLabel(label)),
    infoText,
    setInfoText: text => dispatch(setInfoText(text)),
    resetClicks,
    setResetClicks: clicks => dispatch(setResetClicks(clicks)),
    hasStarted,
    setHasStarted: started => dispatch(setHasStarted(started)),
    resetTimeouts,
    setResetTimeouts,
    handleResetClicksZero,
    handleResetClicksOne,
    handleResetClicksTwoOrMore,
    updateButtonAndInfoText
  };
}

export default useResetStopwatch;
