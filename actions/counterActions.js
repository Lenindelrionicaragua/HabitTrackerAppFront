export const SET_INITIAL_TIME = "SET_INITIAL_TIME";
export const SET_REMAINING_TIME = "SET_REMAINING_TIME";
export const SET_ELAPSED_TIME = "SET_ELAPSED_TIME";
export const SET_TIME_COMPLETED = "SET_TIME_COMPLETED";
export const SET_RUNNING = "SET_RUNNING";
export const SET_START_TIME_REF = "SET_START_TIME_REF";

export const setInitialTime = newInitialTime => {
  return {
    type: SET_INITIAL_TIME,
    payload: newInitialTime
  };
};

export const setRemainingTime = newRemainingTime => {
  return {
    type: SET_REMAINING_TIME,
    payload: newRemainingTime
  };
};

export const setElapsedTime = newElapsedTime => {
  return {
    type: SET_ELAPSED_TIME,
    payload: newElapsedTime
  };
};

export const setTimeCompleted = newTimeCompleted => {
  return {
    type: SET_TIME_COMPLETED,
    payload: newTimeCompleted
  };
};

export const setRunning = newRunning => {
  return {
    type: SET_RUNNING,
    payload: newRunning
  };
};
