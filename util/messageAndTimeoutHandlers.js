// messageAndTimeoutHandlers.js
export const clearMessagesAndTimeouts = (
  timeouts,
  setTimeouts,
  setInfoText
) => {
  if (!Array.isArray(timeouts)) {
    console.error("resetTimeouts should be an array");
    timeouts = [];
  }
  timeouts.forEach(timeout => clearTimeout(timeout));
  setTimeouts([]);
  setInfoText("");
};

export const clearInfoTextAfter = (
  delay,
  setInfoText,
  setResetTimeouts,
  resetTimeouts
) => {
  const timeoutId = setTimeout(() => {
    setInfoText("");
    clearMessagesAndTimeouts(resetTimeouts, setResetTimeouts, setInfoText);
  }, delay);

  setResetTimeouts(prevTimeouts => [...prevTimeouts, timeoutId]);
};
