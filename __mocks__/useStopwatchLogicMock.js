import { useState, useRef } from "react";
import { useInterval } from "../hooks/useInterval";

function useStopwatchLogicMock() {
  const [initialTime, setInitialTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeCompleted, setTimeCompleted] = useState(false);
  const [running, setRunning] = useState(false);

  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const startTimer = initialTime => {
    setInitialTime(initialTime);
    startTimeRef.current = Date.now();
    setRunning(true);
    console.log("start");
  };

  const pauseStopwatch = () => {
    if (running) {
      pauseTimeRef.current = Date.now();
      setRunning(false);
      console.log("pause");
    }
  };

  const resumeStopwatch = () => {
    if (!running) {
      const now = Date.now();
      const pausedDuration = now - pauseTimeRef.current;
      totalPausedTimeRef.current += pausedDuration;
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      setRunning(true);
      console.log("resume");
    }
  };

  const updateTime = () => {
    if (running) {
      const now = Date.now();

      const elapsedTime = Math.floor(
        (now - startTimeRef.current - totalPausedTimeRef.current) / 1000
      );

      const remainingTime = Math.max(0, initialTime - elapsedTime);
      setElapsedTime(elapsedTime);
      setRemainingTime(remainingTime);

      if (remainingTime === 0) {
        setTimeCompleted(true);
        setRunning(false);
      }
    }
    console.log("updateTime:", { elapsedTime, remainingTime, running });
  };

  useInterval(updateTime, running ? 1000 : null);

  return {
    initialTime,
    remainingTime,
    elapsedTime,
    timeCompleted,
    running,
    pauseStopwatch,
    resumeStopwatch,
    startTimer
  };
}

export default useStopwatchLogicMock;
