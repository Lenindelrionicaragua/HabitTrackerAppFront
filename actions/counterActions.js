export const SET_INITIAL_TIME = "SET_INITIAL_TIME";
export const SET_REMAINING_TIME = "SET_REMAINING_TIME";

export const setInitialTime = newInitialTime => ({
  type: SET_INITIAL_TIME,
  payload: newInitialTime
});

export const setRemainingTime = newRemainingTime => ({
  type: SET_REMAINING_TIME,
  payload: newRemainingTime
});
