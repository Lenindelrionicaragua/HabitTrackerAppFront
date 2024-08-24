import { useSelector, useDispatch } from "react-redux";
import {
  setResetButtonLabel,
  setResetClicks,
  setIsRunning
} from "../actions/counterActions";
import useInfoText from "../hooks/useInfoText";
import { usePerformReset } from "../hooks/usePerformReset";

function useResetStopwatch() {
  const performReset = usePerformReset();
  const { setInfoTextWithTimeout, clearTimeoutsAndMessage } = useInfoText();
  const resetButtonLabel = useSelector(
    state => state.resetButtonLabel.resetButtonLabel
  );
  const resetClicks = useSelector(state => state.resetClicks.resetClicks);
  const remainingTime = useSelector(state => state.remainingTime);

  const dispatch = useDispatch();

  const updateButtonLabel = (label, cancelAfter) => {
    dispatch(setResetButtonLabel(label));

    if (cancelAfter) {
      setTimeout(() => {
        dispatch(setResetButtonLabel("RESET"));
        dispatch(setResetClicks(0));
      }, cancelAfter);
    }
  };

  const handleResetClicksZero = () => {
    clearTimeoutsAndMessage();
    if (remainingTime === 0) {
      updateButtonLabel("RESET");
      setInfoTextWithTimeout(
        "The timer is already at zero. Do you want to reset it?",
        10000
      );
    } else {
      updateButtonLabel("CONFIRM RESET", 10000);
      setInfoTextWithTimeout(
        "Are you sure you want to reset the stopwatch?",
        10000
      );
      dispatch(setIsRunning(false));
    }
    setTimeout(() => {
      dispatch(setResetClicks(0));
      setInfoTextWithTimeout("Reset cancelled.", 12000);
    }, 12000);
  };

  const handleResetClicksOne = () => {
    clearTimeoutsAndMessage();
    if (remainingTime !== 0) {
      performReset();
      updateButtonLabel("RESET", 10000);
      setInfoTextWithTimeout("Stopwatch has been reset.", 2000);
    }
  };

  const handleResetClicksTwoOrMore = () => {
    clearTimeoutsAndMessage();
    if (remainingTime === 0) {
      dispatch(setResetClicks(0));
      updateButtonLabel("RESET", 10000);
      setInfoTextWithTimeout("Stopwatch is already reset.", 10000);
    } else {
      performReset();
      updateButtonLabel("RESET", 10000);
      setInfoTextWithTimeout("Stopwatch has been reset.", 10000);
    }
  };

  return {
    resetButtonLabel,
    setResetButtonLabel: label => dispatch(setResetButtonLabel(label)),
    setResetClicks: clicks => dispatch(setResetClicks(clicks)),
    handleResetClicksZero,
    handleResetClicksOne,
    handleResetClicksTwoOrMore
  };
}

export default useResetStopwatch;
