import { useDispatch, useSelector } from "react-redux";
import { setInfoText, setResetTimeoutsIds } from "../actions/counterActions";
import {
  clearMessagesAndTimeouts,
  clearInfoTextAfter
} from "../util/messageAndTimeoutHandlers";

function useMessageAndTimeouts() {
  const dispatch = useDispatch();
  const resetTimeoutsIds = useSelector(
    state => state.resetTimeoutsIds.resetTimeoutsIds
  );

  const clearAllMessagesAndTimeouts = () => {
    clearMessagesAndTimeouts(
      resetTimeoutsIds,
      ids => dispatch(setResetTimeoutsIds(ids)),
      msg => dispatch(setInfoText(msg))
    );
  };

  const setInfoTextWithTimeout = (text, delay) => {
    clearAllMessagesAndTimeouts();
    clearInfoTextAfter(
      delay,
      msg => dispatch(setInfoText(msg)),
      ids => dispatch(setResetTimeoutsIds(ids)),
      resetTimeoutsIds
    );
  };

  return {
    clearAllMessagesAndTimeouts,
    setInfoTextWithTimeout
  };
}

export default useMessageAndTimeouts;
