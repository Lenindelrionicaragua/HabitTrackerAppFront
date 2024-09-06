import { useState, useRef } from "react";
import { useInterval } from "../hooks/useInterval";

function useStopwatchLogicMock() {
  const [initialTime, setInitialTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeCompleted, setTimeCompleted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const startTimer = initialTime => {
    setInitialTime(initialTime);
    startTimeRef.current = Date.now();
    setIsRunning(true);
  };

  const pauseStopwatch = () => {
    if (isRunning) {
      pauseTimeRef.current = Date.now();
      setIsRunning(false);
    }
  };

  const resumeStopwatch = () => {
    if (!isRunning) {
      const now = Date.now();
      const pausedDuration = now - pauseTimeRef.current;
      totalPausedTimeRef.current += pausedDuration;
      setIsRunning(true);
    }
  };

  const updateTime = () => {
    if (isRunning) {
      const now = Date.now();

      const elapsedTime = Math.floor(
        (now - startTimeRef.current - totalPausedTimeRef.current) / 1000
      );

      const remainingTime = Math.max(0, initialTime - elapsedTime);
      setElapsedTime(elapsedTime);
      setRemainingTime(remainingTime);

      if (remainingTime === 0) {
        setTimeCompleted(true);
        setIsRunning(false);
      }
    }
  };

  useInterval(updateTime, isRunning ? 1000 : null);

  return {
    initialTime,
    remainingTime,
    elapsedTime,
    timeCompleted,
    isRunning: isRunning,
    pauseStopwatch,
    resumeStopwatch,
    startTimer
  };
}

export default useStopwatchLogicMock;
