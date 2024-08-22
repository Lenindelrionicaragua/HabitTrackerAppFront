import { useDispatch, useSelector } from "react-redux";
import { setInfoText, setResetTimeoutsIds } from "../actions/counterActions";

function useMessageAndTimeouts() {
  const dispatch = useDispatch();
  const resetTimeoutsIds = useSelector(
    state => state.resetTimeoutsIds.resetTimeoutsIds || []
  );

  // Definición de clearMessagesAndTimeouts dentro del hook
  const clearMessagesAndTimeouts = (
    timeoutIds = [],
    setTimeoutIds = () => {},
    setInfoText = () => {}
  ) => {
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

  // Definición de scheduleInfoTextClear dentro del hook
  const scheduleInfoTextClear = (
    delay,
    setInfoText = () => {},
    setTimeoutIds = () => {},
    timeoutIds = []
  ) => {
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

  const clearAllMessagesAndTimeouts = () => {
    clearMessagesAndTimeouts(
      resetTimeoutsIds,
      ids => dispatch(setResetTimeoutsIds(ids)),
      msg => dispatch(setInfoText(msg))
    );
  };

  const scheduleInfoTextClearInStore = delay => {
    scheduleInfoTextClear(
      delay,
      msg => dispatch(setInfoText(msg)),
      ids => dispatch(setResetTimeoutsIds(ids)),
      resetTimeoutsIds
    );
  };

  return {
    clearAllMessagesAndTimeouts,
    scheduleInfoTextClearInStore,
    resetTimeoutsIds
  };
}

export default useMessageAndTimeouts;
