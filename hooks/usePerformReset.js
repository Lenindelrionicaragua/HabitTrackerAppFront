import { useDispatch } from "react-redux";
import useUpdateCircleColors from "../hooks/useUpdateCircleColors";
import { Colors } from "../styles/AppStyles";
import {
  setInitialTime,
  setRemainingTime,
  setElapsedTime,
  setIsRunning,
  setHabitCategoryIndex,
  setHasStarted,
  setFirstRun,
  setResetClicks,
  setButtonsDisabled,
  setResetButtonLabel,
  setSaveTimeButtonLabel,
  setTimeCompleted
} from "../actions/counterActions";
import { logInfo } from "./../util/logging";

export const usePerformReset = () => {
  const dispatch = useDispatch();
  const { skyBlue, white } = Colors;
  const { updateColors } = useUpdateCircleColors();

  return () => {
    dispatch(setInitialTime(0));
    dispatch(setRemainingTime(0));
    dispatch(setElapsedTime(0));
    dispatch(setIsRunning(false));
    dispatch(setHabitCategoryIndex(null));
    dispatch(setHasStarted(false));
    dispatch(setFirstRun(false));
    dispatch(setResetClicks(0));
    dispatch(setButtonsDisabled(false));
    dispatch(setResetButtonLabel("RESET"));
    dispatch(setSaveTimeButtonLabel("SAVE-TIME"));

    updateColors(skyBlue, white);

    dispatch(setTimeCompleted(false));

    logInfo(`Timer was reset.`);
  };
};
