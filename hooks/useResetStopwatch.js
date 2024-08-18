// import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setResetButtonLabel, setInfoText } from "../actions/counterActions";
import {
  clearInfoTextAfter,
  clearMessagesAndTimeouts
} from "../util/messageAndTimeoutHandlers";

function useResetStopwatch() {
  const resetButtonLabel = useSelector(
    state => state.resetButtonLabel.resetButtonLabel
  );
  const infoText = useSelector(state.infoText.infoText);
  const resetClicks = useSelector(state.resetClicks.resetClicks);
  const resetTimeouts = useSelector(state.resetTimeouts);
  const hasStarted = useSelector(state.hasStarted.hasStarted);
  const setCircleColor = useSelector(state.setCircleColor.setCircleColor);

  const dispatch = useDispatch();

  dispatch(setResetClicks(prevClicks => prevClicks + 1));
  dispatch(setCircleColor(skyBlue));

  clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);

  // Utility function to update button label and info text
  const updateButtonAndInfoText = (label, infoText, cancelAfter) => {
    setResetButtonLabel(label);
    setInfoText(infoText);

    if (cancelAfter) {
      const timeoutId = setTimeout(() => {
        dispatch(setResetButtonLabel("RESET"));
        dispatch(setResetClicks(0);)
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
      clearInterval(intervalRef.current);
    }
    clearInfoTextAfter(12000, setInfoText, setResetTimeouts, resetTimeouts);
  };

  const handleResetClicksOne = () => {
    if (remainingTime !== 0) {
      performReset();
      updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
      clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
    }
  };

  const handleResetClicksTwoOrMore = () => {
    if (remainingTime === 0) {
      dispatch(setResetClicks(0));
      dispatch(setHasStarted(false));
      updateButtonAndInfoText("RESET", "Stopwatch is already reset.", 10000);
    } else {
      performReset();
      updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
    }
    clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
  };

  // Main logic
  if (resetClicks === 0) {
    handleResetClicksZero();
  } else if (resetClicks === 1) {
    handleResetClicksOne();
  } else if (resetClicks >= 2) {
    handleResetClicksTwoOrMore();
  }
}

return {
  resetButtonLabel,
  setResetButtonLabel,
  infoText,
  setInfoText,
  resetClicks,
  setResetClicks,
  hasStarted,
  setHasStarted
};

export default useResetStopwatch;
