// import { useDispatch, useSelector } from "react-redux";
// import { setInfoText, setResetTimeoutsIds } from "../actions/counterActions";

// function useMessageAndTimeouts() {
//   const dispatch = useDispatch();
//   const resetTimeoutsIds = useSelector(
//     state => state.resetTimeoutsIds.resetTimeoutsIds || []
//   );

//   const clearMessagesAndTimeouts = (delay = 0) => {
//     // Clear all existing timeouts
//     resetTimeoutsIds.forEach(id => clearTimeout(id));

//     // Reset the state
//     dispatch(setResetTimeoutsIds([]));
//     dispatch(setInfoText(""));

//     // If a delay is provided, schedule a new timeout to clear info text
//     if (delay > 0) {
//       const timeoutId = setTimeout(() => {
//         dispatch(setInfoText(""));
//         dispatch(setResetTimeoutsIds([])); // Clear the timeout IDs after the text is cleared
//       }, delay);

//       // Update the store with the new timeout ID
//       dispatch(setResetTimeoutsIds([timeoutId]));
//     }
//   };

//   return {
//     clearMessagesAndTimeouts,
//     resetTimeoutsIds
//   };
// }

// export default useMessageAndTimeouts;
