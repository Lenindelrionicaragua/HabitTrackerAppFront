import { useRef } from "react";
import { useInterval } from "../hooks/useInterval";
import { useSelector, useDispatch } from "react-redux";
import {
  setRemainingTime,
  setInitialTime,
  setElapsedTime,
  setTimeCompleted,
  setIsRunning
} from "../actions/counterActions";

function useStopwatch() {
  const initialTime = useSelector(state => state.initialTime.initialTime);
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const isRunning = useSelector(state => state.isRunning.isRunning);

  const dispatch = useDispatch();

  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const startTimer = initialTime => {
    dispatch(setInitialTime(initialTime));
    startTimeRef.current = Date.now();
    dispatch(setIsRunning(true));
  };

  const pauseStopwatch = () => {
    pauseTimeRef.current = Date.now();
    dispatch(setIsRunning(false));
  };

  const resumeStopwatch = () => {
    if (!isRunning) {
      const now = Date.now();
      totalPausedTimeRef.current += now - pauseTimeRef.current;

      dispatch(setIsRunning(true));
    }
  };

  const updateTime = () => {
    if (isRunning) {
      const now = Date.now();

      const elapsedTime = Math.floor(
        (now - startTimeRef.current - totalPausedTimeRef.current) / 1000
      );

      const remainingTime = Math.max(0, initialTime - elapsedTime);
      dispatch(setElapsedTime(elapsedTime));
      dispatch(setRemainingTime(remainingTime));

      if (remainingTime === 0) {
        dispatch(setTimeCompleted(true));
        dispatch(setIsRunning(false));
      }
    }
  };

  useInterval(updateTime, isRunning ? 1000 : null);

  return {
    initialTime,
    setInitialTime: newInitialTime => dispatch(setInitialTime(newInitialTime)),
    remainingTime,
    setRemainingTime: newRemainingTime =>
      dispatch(setRemainingTime(newRemainingTime)),
    elapsedTime,
    setElapsedTime: newElapsedTime => dispatch(setElapsedTime(newElapsedTime)),
    timeCompleted,
    setTimeCompleted: newTimeCompleted =>
      dispatch(setTimeCompleted(newTimeCompleted)),
    isRunning,
    setIsRunning: newIsRunning => dispatch(setIsRunning(newIsRunning)),
    pauseStopwatch,
    resumeStopwatch,
    startTimer
  };
}

export default useStopwatch;
