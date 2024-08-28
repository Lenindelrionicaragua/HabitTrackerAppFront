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
  setFirstRun,
  setActivities
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
  const activities = useSelector(state => state.activities.activities);
  const firstRun = useSelector(state => state.firstRun.firstRun);

  logInfo(`remainginTime intialState: ${remainingTime}`);
  logInfo(`isRunning initial State: ${isRunning}`);

  const dispatch = useDispatch();

  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const MAX_TIME_HOURS = 99;
  const MAX_TIME_SECONDS = MAX_TIME_HOURS * 3600;
  const MIN_TIME_MINUTES = 0;

  // Function to start the timer with a specified initial time
  const startTimer = initialTime => {
    dispatch(setInitialTime(initialTime));
    startTimeRef.current = Date.now();
    dispatch(setIsRunning(true));
  };

  // Function to pause the stopwatch
  const pauseStopwatch = () => {
    pauseTimeRef.current = Date.now();
    dispatch(setIsRunning(false));
  };

  // Function to resume the stopwatch
  const resumeStopwatch = () => {
    if (!isRunning) {
      const now = Date.now();
      totalPausedTimeRef.current += now - pauseTimeRef.current;
      dispatch(setIsRunning(true));
    }
  };

  // Update the time each second
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

  // Function to handle time selection (similar to handleTimeSelection)
  const handleTimeSelection = selectedTime => {
    const newInitialTime = Math.max(selectedTime, MIN_TIME_MINUTES);

    if (newInitialTime <= MAX_TIME_SECONDS) {
      dispatch(setInitialTime(newInitialTime));
      dispatch(setRemainingTime(newInitialTime));
      dispatch(setElapsedTime(0));
      dispatch(setIsRunning(false));
    } else {
      dispatch(setInitialTime(MAX_TIME_SECONDS));
      dispatch(setRemainingTime(MAX_TIME_SECONDS));
    }
  };

  const handleNoActivityNoTime = () => {
    dispatch(setActivityIndex(0));
    handleTimeSelection(300);
    setInfoTextWithTimeout("Default time and activity selected.", 5000);
    dispatch(setHasStarted(true));
  };

  const handleActivityNoTime = () => {
    handleTimeSelection(300);
    setInfoTextWithTimeout("Default time selected.", 5000);
    dispatch(setHasStarted(true));
  };

  const handleNoActivityTime = () => {
    dispatch(setActivityIndex(0));
    handleTimeSelection(remainingTime);
    setInfoTextWithTimeout("Default activity selected.", 5000);
    dispatch(setHasStarted(true));
  };

  const handleActivityTime = () => {
    startTimer(remainingTime);
    setInfoTextWithTimeout("Timer started with the selected activity.", 5000);
    dispatch(setFirstRun(true));
    dispatch(setHasStarted(true));
  };

  const handleActivityChange = () => {
    const newIndex =
      activityIndex === activities.length - 1 ? 0 : activityIndex + 1;

    dispatch(setIsRunning(false));
    dispatch(setActivityIndex(newIndex));
    clearTimeoutsAndMessage();
  };

  useInterval(updateTime, isRunning ? 1000 : null);

  return {
    pauseStopwatch,
    resumeStopwatch,
    startTimer,
    handleTimeSelection,
    handleActivityChange,
    handleNoActivityNoTime,
    handleActivityNoTime,
    handleNoActivityTime,
    handleActivityTime
  };
}

export default useStopwatch;
