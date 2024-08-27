import { useRef } from "react";
import { useInterval } from "../hooks/useInterval";
import { useSelector, useDispatch } from "react-redux";
import {
  setRemainingTime,
  setInitialTime,
  setElapsedTime,
  setTimeCompleted,
  setIsRunning,
  setHasStarted,
  setActivityIndex,
  setFirstRun
} from "../actions/counterActions";
import useInfoText from "../hooks/useInfoText";
import { logInfo } from "../util/logging";

function useStopwatch() {
  const { setInfoTextWithTimeout, clearTimeoutsAndMessage } = useInfoText();
  const initialTime = useSelector(state => state.initialTime.initialTime);
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const isRunning = useSelector(state => state.isRunning.isRunning);
  const hasStarted = useSelector(state => state.hasStarted.hasStarted);
  const activityIndex = useSelector(state => state.activityIndex.activityIndex);
  const firstRun = useSelector(state => state.firstRun.firstRun);

  const dispatch = useDispatch();

  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const startTimer = initialTime => {
    clearTimeoutsAndMessage();
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

  const setDefaultsAndStartTimer = (activityIdx, time, infoText) => {
    dispatch(setActivityIndex(activityIdx));
    clearTimeoutsAndMessage();
    setInfoTextWithTimeout(infoText, 5000);
  };

  const handleNoActivityNoTime = () => {
    setDefaultsAndStartTimer(0, 300, "Default time and activity selected.");
    dispatch(setHasStarted(true));
  };

  const handleActivityNoTime = () => {
    setDefaultsAndStartTimer(activityIndex, 300, "Default time selected.");
    dispatch(setHasStarted(true));
  };

  const handleNoActivityTime = () => {
    setDefaultsAndStartTimer(0, remainingTime, "Default activity selected.");
    dispatch(setHasStarted(true));
  };

  const handleActivityTime = () => {
    startTimer(remainingTime);
    dispatch(setIsRunning(true));
    dispatch(setFirstRun(true));
    dispatch(setHasStarted(true));
    setInfoTextWithTimeout("Timer started with the selected activity.", 5000);
  };

  useInterval(updateTime, isRunning ? 1000 : null);

  return {
    pauseStopwatch,
    resumeStopwatch,
    startTimer,
    handleNoActivityNoTime,
    handleActivityNoTime,
    handleNoActivityTime,
    handleActivityTime
  };
}

export default useStopwatch;
