import { useState, useRef } from "react";

export const useStopwatchLogic = (
  defaultActivityIndex,
  defaultTime,
  resetTimeouts,
  setResetTimeouts,
  setInfoText
) => {
  const [activityIndex, setActivityIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [firstRun, setFirstRun] = useState(false);
  const [running, setRunning] = useState(false);

  const startStopwatch = () => {
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);

    const startTimer = initialTime => {
      setCircleColor("skyBlue");
      logInfo(`Initial time: ${formatTime(initialTime)}`);
      startTimeRef.current = Date.now();
      setRunning(true);
    };

    const setDefaultsAndStartTimer = (activityIdx, time, infoText) => {
      setActivityIndex(defaultActivityIndex);
      handleTimeSelection(time);
      setInfoText(infoText);
      clearInfoTextAfter(5000, setInfoText, setResetTimeouts, resetTimeouts);
    };

    const handleNoActivityNoTime = () => {
      setDefaultsAndStartTimer(
        defaultActivityIndex,
        defaultTime,
        "Default time and activity selected."
      );
      setHasStarted(true);
    };

    const handleActivityNoTime = () => {
      setDefaultsAndStartTimer(
        activityIndex,
        defaultTime,
        "Default time selected."
      );
      setHasStarted(true);
    };

    const handleNoActivityTime = () => {
      setDefaultsAndStartTimer(
        defaultActivityIndex,
        remainingTime,
        "Default activity selected."
      );
      setHasStarted(true);
    };

    const handleActivityTime = () => {
      startTimer(remainingTime);
      setInfoText("Timer started with the selected activity.");
      clearInfoTextAfter(5000);
      setRunning(true);
      setFirstRun(true);
      setHasStarted(true);
    };

    if (!hasStarted) {
      if (activityIndex === null && remainingTime === 0) {
        handleNoActivityNoTime();
      } else if (activityIndex !== null && remainingTime === 0) {
        handleActivityNoTime();
      } else if (activityIndex === null && remainingTime > 0) {
        handleNoActivityTime();
      } else if (activityIndex !== null && remainingTime > 0) {
        handleActivityTime();
      }
    } else {
      if (activityIndex !== null && remainingTime > 0) {
        if (!firstRun) {
          handleActivityTime();
        } else {
          resumeStopwatch();
        }
      }
    }
  };

  return { startStopwatch };
};
