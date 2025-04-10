import React from "react";
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
  const remainingTime = useSelector(state => state.remainingTime);

  const dispatch = useDispatch();
  const [resetTimeoutId, setResetTimeoutId] = React.useState(null);

  const updateButtonLabel = (label, cancelAfter) => {
    dispatch(setResetButtonLabel(label));

    if (resetTimeoutId) {
      clearTimeout(resetTimeoutId);
      setResetTimeoutId(null);
    }

    if (cancelAfter) {
      const newTimeoutId = setTimeout(() => {
        dispatch(setResetButtonLabel("RESET"));
        dispatch(setResetClicks(0));
        updateInfoText("Reset cancelled.");
      }, cancelAfter);
      setResetTimeoutId(newTimeoutId);
    }
  };

  const handleResetClicksZero = () => {
    clearTimeoutsAndMessage();
    if (remainingTime === 0) {
      updateInfoText("The timer is already at zero. Do you want to reset it?");
    } else {
      updateButtonLabel("CONFIRM RESET", 5000);
      updateInfoText("Are you sure you want to reset the stopwatch?");
      dispatch(setIsRunning(false));
    }
    setTimeout(() => {
      dispatch(setResetClicks(0));
    }, 5000);
  };

  const handleResetClicksOne = () => {
    clearTimeoutsAndMessage();
    if (remainingTime !== 0) {
      performReset();
      updateButtonLabel("RESET");
      updateInfoText("Stopwatch has been reset.");
    }
  };

  const handleResetClicksTwoOrMore = () => {
    clearTimeoutsAndMessage();
    if (remainingTime === 0) {
      dispatch(setResetClicks(0));
      updateButtonLabel("RESET");
      updateInfoText("Stopwatch is already reset.");
    } else {
      performReset();
      updateButtonLabel("RESET");
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
