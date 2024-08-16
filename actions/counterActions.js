export const SET_TIME = "SET_TIME";

export const setTime = newTime => {
  // console.log("Action creator called with:", newTime);
  return {
    type: SET_TIME,
    payload: newTime
  };
};
