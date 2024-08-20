// Function to clear messages and timeouts in the buttons
export const clearMessagesAndTimeouts = (
  resetTimeoutsIds = [],
  setResetTimeoutsIds = () => {},
  setInfoText = () => {}
) => {
  resetTimeoutsIds.forEach(timeoutId => clearTimeout(timeoutId));
  setResetTimeoutsIds([]);
  setInfoText("");
};

// Function to clear infoText after a delay
export const clearInfoTextAfter = (
  delay,
  setInfoText = () => {},
  setResetTimeoutsIds = () => {},
  resetTimeoutsIds = []
) => {
  const timeoutId = setTimeout(() => setInfoText(""), delay);
  setResetTimeoutsIds(prevTimeouts => [...prevTimeouts, timeoutId]);
};
