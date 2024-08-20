import { useRef } from "react";
import { useInterval } from "../hooks/useInterval";
import { useSelector, useDispatch } from "react-redux";
import {
  setRemainingTime,
  setInitialTime,
  setElapsedTime,
  setTimeCompleted,
  setIsRunning,
  setResetTimeoutsIds,
  setInfoText,
  setHasStarted,
  setActivityIndex,
  setFirstRun
} from "../actions/counterActions";
import useMessageAndTimeouts from "./useMessageAndTimeouts";

function useStopwatch() {
  const initialTime = useSelector(state => state.initialTime.initialTime);
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const isRunning = useSelector(state => state.isRunning.isRunning);
  const hasStarted = useSelector(state => state.hasStarted.hasStarted);
  const activityIndex = useSelector(state => state.activityIndex.activityIndex);
  const firstRun = useSelector(state => state.firstRun.firstRun);
  const resetTimeoutsIds = useSelector(
    state => state.resetTimeoutsIds.resetTimeoutsIds
  );

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

  const setDefaultsAndStartTimer = (activityIdx, time, infoText) => {
    dispatch(setActivityIndex(activityIdx));
    dispatch(setInitialTime(time));
    dispatch(setInfoText(infoText));
    clearMessagesAndTimeouts(
      resetTimeoutsIds,
      ids => dispatch(setResetTimeoutsIds(ids)),
      msg => dispatch(setInfoText(msg))
    );
    clearInfoTextAfter(
      5000,
      msg => dispatch(setInfoText(msg)),
      ids => dispatch(setResetTimeoutsIds(ids)),
      resetTimeoutsIds
    );
  };

  const handleNoActivityNoTime = () => {
    setDefaultsAndStartTimer(null, 600, "Default time and activity selected.");
    dispatch(setHasStarted(true));
  };

  const handleActivityNoTime = () => {
    setDefaultsAndStartTimer(activityIndex, 600, "Default time selected.");
    dispatch(setHasStarted(true));
  };

  const handleNoActivityTime = () => {
    setDefaultsAndStartTimer(null, remainingTime, "Default activity selected.");
    dispatch(setHasStarted(true));
  };

  const handleActivityTime = () => {
    startTimer(remainingTime);
    dispatch(setInfoText("Timer started with the selected activity."));
    clearInfoTextAfter(
      5000,
      msg => dispatch(setInfoText(msg)),
      ids => dispatch(setResetTimeoutsIds(ids)),
      resetTimeoutsIds
    );
    dispatch(setIsRunning(true));
    dispatch(setFirstRun(true));
    dispatch(setHasStarted(true));
  };

  useInterval(updateTime, isRunning ? 1000 : null);

  return {
    initialTime,
    remainingTime,
    elapsedTime,
    timeCompleted,
    isRunning,
    hasStarted,
    activityIndex,
    firstRun,
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
