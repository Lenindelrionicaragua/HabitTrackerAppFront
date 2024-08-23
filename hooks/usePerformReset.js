import { useDispatch } from "react-redux";
import { updateColors } from "../hooks/useUpdateCircleColor";
import { Colors } from "../styles/AppStyles";
import {
  setInitialTime,
  setRemainingTime,
  setElapsedTime,
  setIsRunning,
  setActivityIndex,
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

  return () => {
    dispatch(setInitialTime(0));
    dispatch(setRemainingTime(0));
    dispatch(setElapsedTime(0));
    dispatch(setIsRunning(false));
    dispatch(setActivityIndex(null));
    dispatch(setHasStarted(false));
    dispatch(setFirstRun(false));
    dispatch(setResetClicks(0));
    dispatch(setButtonsDisabled(false));
    dispatch(setResetButtonLabel("RESET"));
    dispatch(setSaveTimeButtonLabel("SAVE-TIME"));

    updateColors(skyBlue, white);

    dispatch(setTimeCompleted(true));

    logInfo(`Timer was reset.`);
  };
};
