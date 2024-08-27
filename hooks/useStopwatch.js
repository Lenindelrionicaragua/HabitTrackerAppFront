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

const activities = [
  "Study",
  "Work",
  "Exercise",
  "Family time",
  "Screen-free time",
  "Rest"
];

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

  const dispatch = useDispatch();

  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const MAX_TIME_SECONDS = 99 * 3600; // Maximum time in seconds
  const MIN_TIME_MINUTES = 0; // Minimum time in seconds

  // Function to start the timer with a specified initial time
  const startTimer = selectedTime => {
    clearTimeoutsAndMessage();
    dispatch(setInitialTime(selectedTime));
    dispatch(setRemainingTime(selectedTime));
    dispatch(setElapsedTime(0));
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
    const finalTime =
      newInitialTime <= MAX_TIME_SECONDS ? newInitialTime : MAX_TIME_SECONDS;

    dispatch(setInitialTime(finalTime));
    dispatch(setRemainingTime(finalTime));
    dispatch(setElapsedTime(0));
    dispatch(setIsRunning(false));
  };

  const setDefaultsAndStartTimer = (activityIdx, time, infoText) => {
    dispatch(setActivityIndex(activityIdx));
    handleTimeSelection(time); // Update time selection logic
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

  const handleActivityChange = () => {
    const newIndex =
      activityIndex === activities.length - 1 ? 0 : activityIndex + 1;

    dispatch(setIsRunning(false));
    dispatch(setActivityIndex(newIndex));
    setInfoTextWithTimeout("", 1000);
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
