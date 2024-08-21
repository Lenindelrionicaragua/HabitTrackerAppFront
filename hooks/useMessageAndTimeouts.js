import { useDispatch, useSelector } from "react-redux";
import { setInfoText, setResetTimeoutsIds } from "../actions/counterActions";
import {
  clearMessagesAndTimeouts,
  scheduleInfoTextClear
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

  const scheduleInfoTextClearInStore = () => {
    scheduleInfoTextClear(
      msg => dispatch(setInfoText(msg)),
      ids => dispatch(setResetTimeoutsIds(ids)),
      resetTimeoutsIds
    );
  };

  return {
    clearAllMessagesAndTimeouts,
    scheduleInfoTextClearInStore
  };
}

export default useMessageAndTimeouts;
