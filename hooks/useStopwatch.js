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
  setHabitCategoryIndex,
  setFirstRun
} from "../actions/counterActions";
import useInfoText from "../hooks/useInfoText";

function useStopwatch() {
  const { updateInfoText, clearTimeoutsAndMessage } = useInfoText();
  const initialTime = useSelector(state => state.initialTime.initialTime);
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const isRunning = useSelector(state => state.isRunning.isRunning);
  const hasStarted = useSelector(state => state.hasStarted.hasStarted);
  const habitCategoryIndex = useSelector(
    state => state.habitCategoryIndex.habitCategoryIndex
  );
  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );
  const firstRun = useSelector(state => state.firstRun.firstRun);

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

    setTimeout(() => {
      clearTimeoutsAndMessage();
    }, 3000);
  };

  // Function to pause the stopwatch
  const pauseStopwatch = () => {
    if (isRunning) {
      updateInfoText("Timer paused.");
      pauseTimeRef.current = Date.now();
      dispatch(setIsRunning(false));
    }
  };

  // Function to resume the stopwatch
  const resumeStopwatch = () => {
    if (!isRunning) {
      updateInfoText("Timer resume.");
      const now = Date.now();
      const pausedDuration = now - pauseTimeRef.current;
      totalPausedTimeRef.current += pausedDuration;

      dispatch(setIsRunning(true));

      setTimeout(() => {
        clearTimeoutsAndMessage();
      }, 3000);
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

      if (remainingTime <= 0) {
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

  const handleNoHabitCategoryNoTime = () => {
    dispatch(setHabitCategoryIndex(0));
    handleTimeSelection(300);
    updateInfoText("Default time and habit category selected.");
    dispatch(setHasStarted(true));
  };

  const handleHabitCategoryNoTime = () => {
    handleTimeSelection(300);
    updateInfoText("Default time selected.");
    dispatch(setHasStarted(true));
  };

  const handleNoHabitCategoryTime = () => {
    dispatch(setHabitCategoryIndex(0));
    handleTimeSelection(remainingTime);
    updateInfoText("Default habit category selected.");
    dispatch(setHasStarted(true));
  };

  const handleHabitCategoryTime = () => {
    startTimer(remainingTime);
    updateInfoText("Timer started with time and habit category selected.");
    dispatch(setFirstRun(true));
    dispatch(setHasStarted(true));
  };

  const handleHabitCategoryChange = () => {
    const newIndex =
      habitCategoryIndex === habitCategories.length - 1
        ? 0
        : habitCategoryIndex + 1;

    dispatch(setIsRunning(false));
    dispatch(setHabitCategoryIndex(newIndex));
    clearTimeoutsAndMessage();
  };

  useInterval(updateTime, isRunning ? 1000 : null);

  return {
    pauseStopwatch,
    resumeStopwatch,
    startTimer,
    handleTimeSelection,
    handleHabitCategoryChange,
    handleNoHabitCategoryNoTime,
    handleHabitCategoryNoTime,
    handleNoHabitCategoryTime,
    handleHabitCategoryTime
  };
}

export default useStopwatch;
