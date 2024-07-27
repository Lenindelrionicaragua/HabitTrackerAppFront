// Function to clear messages and timeouts in the buttons
export const clearMessagesAndTimeouts = (
  resetTimeouts = [],
  setResetTimeouts = () => {},
  setInfoText = () => {}
) => {
  resetTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  setResetTimeouts([]);
  setInfoText("");
};

// Function to clear infoText after a delay
export const clearInfoTextAfter = (
  delay,
  setInfoText = () => {},
  setResetTimeouts = () => {},
  resetTimeouts = []
) => {
  const timeoutId = setTimeout(() => setInfoText(""), delay);
  setResetTimeouts(prevTimeouts => [...prevTimeouts, timeoutId]);
};
