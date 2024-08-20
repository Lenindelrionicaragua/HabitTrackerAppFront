export const clearMessagesAndTimeouts = (
  timeoutIds,
  setTimeoutIds,
  setInfoText
) => {
  timeoutIds.forEach(id => clearTimeout(id));
  setTimeoutIds([]);
  setInfoText("");
};

export const scheduleInfoTextClear = (
  delay,
  setInfoText,
  setTimeoutIds,
  timeoutIds
) => {
  const timeoutId = setTimeout(() => {
    setInfoText("");
  }, delay);
  setTimeoutIds(prevIds => [...prevIds, timeoutId]);
};
