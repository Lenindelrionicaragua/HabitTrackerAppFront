import { useState, useRef } from "react";
import { useInterval } from "../hooks/useInterval";
import { useSelector, useDispatch } from "react-redux";
import {
  setRemainingTime,
  setInitialTime,
  setElapsedTime,
  setTimeCompleted,
  setRunning
} from "../actions/counterActions";

function useStopwatch() {
  const initialTime = useSelector(state => state.initialTime.initialTime);
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const running = useSelector(state => state.running.running);

  const dispatch = useDispatch();

  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const startTimer = initialTime => {
    dispatch(setInitialTime(initialTime));
    startTimeRef.current = Date.now();
    dispatch(setRunning(true));
  };

  const pauseStopwatch = () => {
    pauseTimeRef.current = Date.now();
    dispatch(setRunning(false));
  };

  const resumeStopwatch = () => {
    if (!running) {
      const now = Date.now();
      totalPausedTimeRef.current += now - pauseTimeRef.current;

      dispatch(setRunning(true));
    }
  };

  const updateTime = () => {
    if (running) {
      const now = Date.now();

      const elapsedTime = Math.floor(
        (now - startTimeRef.current - totalPausedTimeRef.current) / 1000
      );

      const remainingTime = Math.max(0, initialTime - elapsedTime);
      dispatch(setElapsedTime(elapsedTime));
      dispatch(setRemainingTime(remainingTime));

      if (remainingTime === 0) {
        dispatch(setTimeCompleted(true));
        dispatch(setRunning(false));
      }
    }
  };

  useInterval(updateTime, running ? 1000 : null);

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
    running,
    setRunning: newRunning => dispatch(setRunning(newRunning)),
    pauseStopwatch,
    resumeStopwatch,
    startTimer
  };
}

export default useStopwatch;
