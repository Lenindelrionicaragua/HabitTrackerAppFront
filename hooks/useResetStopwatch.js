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
  const { updateInfoText, clearTimeoutsAndMessage } = useInfoText();
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
      updateInfoText("The timer is already at zero. Do you want to reset it?");
    } else {
      updateButtonLabel("CONFIRM RESET");
      updateInfoText("Are you sure you want to reset the stopwatch?");
      dispatch(setIsRunning(false));
    }
    setTimeout(() => {
      dispatch(setResetClicks(0));
      updateInfoText("Reset cancelled.");
    }, 12000);
  };

  const handleResetClicksOne = () => {
    clearTimeoutsAndMessage();
    if (remainingTime !== 0) {
      performReset();
      updateButtonLabel("RESET", 10000);
      updateInfoText("Stopwatch has been reset.");
    }
  };

  const handleResetClicksTwoOrMore = () => {
    clearTimeoutsAndMessage();
    if (remainingTime === 0) {
      dispatch(setResetClicks(0));
      updateButtonLabel("RESET", 10000);
      updateInfoText("Stopwatch is already reset.");
    } else {
      performReset();
      updateButtonLabel("RESET", 10000);
      updateInfoText("Stopwatch has been reset.");
    }
  };

  return {
    resetButtonLabel,
    handleResetClicksZero,
    handleResetClicksOne,
    handleResetClicksTwoOrMore
  };
}

export default useResetStopwatch;
