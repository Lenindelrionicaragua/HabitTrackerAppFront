import { useSelector, useDispatch } from "react-redux";
import {
  setResetButtonLabel,
  setInfoText,
  setResetClicks,
  setResetTimeoutsIds,
  setIsRunning
} from "../actions/counterActions";
import useMessageAndTimeouts from "../hooks/useMessageAndTimeouts";

function useResetStopwatch() {
  const { setInfoTextWithTimeout, clearAllMessagesAndTimeouts } =
    useMessageAndTimeouts();
  const resetButtonLabel = useSelector(
    state => state.resetButtonLabel.resetButtonLabel
  );
  const infoText = useSelector(state => state.infoText.infoText);
  const resetClicks = useSelector(state => state.resetClicks.resetClicks);
  const remainingTime = useSelector(state => state.remainingTime);

  const dispatch = useDispatch();

  const clearPreviousTimeouts = () => {
    clearMessagesAndTimeouts(
      resetTimeoutsIds,
      setResetTimeoutsIds,
      setInfoText
    );
  };

  const updateButtonAndInfoText = (label, infoText, cancelAfter) => {
    dispatch(setResetButtonLabel(label));
    dispatch(setInfoText(infoText));

    if (cancelAfter) {
      const timeoutId = setTimeout(() => {
        dispatch(setResetButtonLabel("RESET"));
        dispatch(setResetClicks(0));
        dispatch(setInfoText("Reset cancelled."));
      }, cancelAfter);
      dispatch(
        setResetTimeoutsIds(prevTimeouts => [...prevTimeouts, timeoutId])
      );
    }
  };

  const handleResetClicksZero = () => {
    clearPreviousTimeouts();
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
    setInfoTextWithTimeout("Reset cancelled.", 12000);
  };

  const handleResetClicksOne = () => {
    clearPreviousTimeouts();
    if (remainingTime !== 0) {
      updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
      setInfoTextWithTimeout("Stopwatch has been reset.", 2000);
    }
  };

  const handleResetClicksTwoOrMore = () => {
    clearPreviousTimeouts();
    if (remainingTime === 0) {
      dispatch(setResetClicks(0));
      updateButtonAndInfoText("RESET", "Stopwatch is already reset.", 10000);
    } else {
      updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
    }
    setInfoTextWithTimeout("Stopwatch has been reset.", 2000);
  };

  return {
    resetButtonLabel,
    setResetButtonLabel: label => dispatch(setResetButtonLabel(label)),
    infoText,
    setResetClicks: clicks => dispatch(setResetClicks(clicks)),
    handleResetClicksZero,
    handleResetClicksOne,
    handleResetClicksTwoOrMore,
    updateButtonAndInfoText
  };
}

export default useResetStopwatch;
