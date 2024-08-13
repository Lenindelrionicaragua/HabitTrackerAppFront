// hooks/useResetStopwatch.js
import { useState } from "react";

export const useResetStopwatch = (
  resetTimeouts,
  setResetTimeouts,
  setInfoText,
  remainingTime
) => {
  const [resetClicks, setResetClicks] = useState(0);

  const resetStopwatch = () => {
    setResetClicks(prevClicks => prevClicks + 1);
    setCircleColor(skyBlue);

    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);

    const updateButtonAndInfoText = (label, infoText, cancelAfter) => {
      setResetButtonLabel(label);
      setInfoText(infoText);

      if (cancelAfter) {
        const timeoutId = setTimeout(() => {
          setResetButtonLabel("RESET");
          setResetClicks(0);
          setInfoText("Reset cancelled.");
        }, cancelAfter);
        setResetTimeouts(prevTimeouts => [...prevTimeouts, timeoutId]);
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
        setResetClicks(0);
        setHasStarted(false);
        updateButtonAndInfoText("RESET", "Stopwatch is already reset.", 10000);
      } else {
        performReset();
        updateButtonAndInfoText("RESET", "Stopwatch has been reset.", 10000);
      }
      clearInfoTextAfter(2000, setInfoText, setResetTimeouts, resetTimeouts);
    };

    if (resetClicks === 0) {
      handleResetClicksZero();
    } else if (resetClicks === 1) {
      handleResetClicksOne();
    } else if (resetClicks >= 2) {
      handleResetClicksTwoOrMore();
    }
  };

  return { resetStopwatch };
};
