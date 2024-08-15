export const SET_TIME = "SET_TIME";

export const setTime = newTime => {
  return {
    type: SET_TIME,
    payload: newTime
  };
};
