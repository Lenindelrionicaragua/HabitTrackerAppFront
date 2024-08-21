/**
 * Clears all timeouts and resets the info text and timeout IDs.
 *
 * @param {Array} timeoutIds - List of timeout IDs to clear.
 * @param {Function} setTimeoutIds - Function to update the list of timeout IDs.
 * @param {Function} setInfoText - Function to reset the info text.
 * @throws {TypeError} If `timeoutIds` is not an array or `setTimeoutIds` and `setInfoText` are not functions.
 */

export const clearMessagesAndTimeouts = (
  timeoutIds = [],
  setTimeoutIds = () => {},
  setInfoText = () => {}
) => {
  // Validate input types
  if (!Array.isArray(timeoutIds)) {
    throw new TypeError("Expected `timeoutIds` to be an array");
  }

  if (
    typeof setTimeoutIds !== "function" ||
    typeof setInfoText !== "function"
  ) {
    throw new TypeError(
      "Expected `setTimeoutIds` and `setInfoText` to be functions"
    );
  }

  // Clear all timeouts
  timeoutIds.forEach(id => clearTimeout(id));

  // Reset state
  setTimeoutIds([]);
  setInfoText("");
};

/**
 * Schedules clearing the info text after a specified delay and updates the list of timeout IDs.
 *
 * @param {number} delay - Delay in milliseconds before clearing the info text.
 * @param {Function} setInfoText - Function to set the info text.
 * @param {Function} setTimeoutIds - Function to update the list of timeout IDs.
 * @param {Array} timeoutIds - Array of current timeout IDs.
 * @throws {TypeError} If `delay` is not a number or `setInfoText` and `setTimeoutIds` are not functions.
 */

export const scheduleInfoTextClear = (
  delay,
  setInfoText = () => {},
  setTimeoutIds = () => {},
  timeoutIds = []
) => {
  // Validate input types
  if (typeof delay !== "number") {
    throw new TypeError("Expected `delay` to be a number");
  }

  if (
    typeof setInfoText !== "function" ||
    typeof setTimeoutIds !== "function"
  ) {
    throw new TypeError(
      "Expected `setInfoText` and `setTimeoutIds` to be functions"
    );
  }

  // Schedule the timeout
  const timeoutId = setTimeout(() => setInfoText(""), delay);

  // Update timeout IDs
  setTimeoutIds(prevIds => [...prevIds, timeoutId]);
};
