export const clearMessagesAndTimeouts = (
  timeoutIds = [],
  setTimeoutIds = () => {},
  setInfoText = () => {}
) => {
  if (!Array.isArray(timeoutIds)) {
    throw new TypeError("timeoutIds should be an array");
  }

  timeoutIds.forEach(id => clearTimeout(id));
  setTimeoutIds([]);
  setInfoText("");
};

/**
 * Schedules clearing the info text after a specified delay and updates the list of timeout IDs.
 *
 * @param {number} delay - The delay in milliseconds before clearing the info text.
 * @param {Function} setInfoText - Function to set the info text.
 * @param {Function} setTimeoutIds - Function to update the list of timeout IDs.
 * @param {Array} timeoutIds - Array of current timeout IDs.
 */

export const scheduleInfoTextClear = (
  delay,
  setInfoText = () => {},
  setTimeoutIds = () => {},
  timeoutIds = []
) => {
  if (typeof delay !== "number") {
    throw new TypeError("delay should be a number");
  }

  if (
    typeof setInfoText !== "function" ||
    typeof setTimeoutIds !== "function"
  ) {
    throw new TypeError("setInfoText and setTimeoutIds should be functions");
  }

  const timeoutId = setTimeout(() => {
    setInfoText("");
  }, delay);

  // Update timeout IDs with the new timeout ID
  setTimeoutIds(prevIds => [...prevIds, timeoutId]);
};
