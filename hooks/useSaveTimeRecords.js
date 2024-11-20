import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logInfo, logError } from "../util/logging";
import {
  setIsRunning,
  setSaveTimeButtonLabel,
  setButtonsDisabled
} from "../actions/counterActions";
import useInfoText from "./useInfoText";
import useUpdateCircleColors from "./useUpdateCircleColors";
import useSaveDailyRecords from "./api/useSaveDailyRecords";
import { usePerformReset } from "./usePerformReset";
import { formatTime } from "../util/formatTime";
import { usePlayAlarm } from "./usePlayAlarm";
import { Colors } from "../styles/AppStyles";
import { CredentialsContext } from "../context/credentialsContext";

function useSaveTimeRecords() {
  const dispatch = useDispatch();
  const { storedCredentials } = useContext(CredentialsContext);
  // Store
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const firstRun = useSelector(state => state.firstRun.firstRun);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  // Hooks
  const { updateColors } = useUpdateCircleColors();
  const performReset = usePerformReset();
  const { updateInfoText, clearTimeoutsAndMessage } = useInfoText();
  const { error, isLoading, createDailyRecord } = useSaveDailyRecords();
  const { playAlarm } = usePlayAlarm(logInfo, logError);

  const { green, red } = Colors;

  const saveTimeRecords = async () => {
    clearTimeoutsAndMessage();
    dispatch(setIsRunning(false));

    if (storedCredentials === null) {
      updateInfoText("Log in to save your stats and track your progress.");
      return;
    }

    if (remainingTime === 0 && !firstRun) {
      updateInfoText("No time recorded. Please start the timer before saving.");
      return;
    }

    if ((remainingTime !== 0 && firstRun) || timeCompleted) {
      logInfo(`Remaining time saved: ${formatTime(remainingTime)}`);
      logInfo(`Elapsed time saved: ${formatTime(elapsedTime)}`);
      await processSaveAndUpdateUI();
      return;
    }
  };

  const processSaveAndUpdateUI = async () => {
    dispatch(setSaveTimeButtonLabel("SAVING"));
    updateInfoText("Saving");
    updateColors(green, green);
    dispatch(setButtonsDisabled(true));

    try {
      const { success, error } = await createDailyRecord();

      if (success) {
        updateInfoText("Time saved successfully");
        setTimeout(() => {
          if (!timeCompleted) {
            playAlarm(require("../assets/alarm_2.wav"));
          }
          performReset();
        }, 3000);
      } else {
        logError("Failed to save record.", error);
        updateInfoText("Failed to save the record.");
        updateColors(red, red);
        return;
      }
    } catch (err) {
      logError("Unexpected error occurred.", err);
      updateInfoText("Unexpected error occurred.");
      updateColors(red, red);
    } finally {
      dispatch(setButtonsDisabled(false));
    }
  };

  return {
    saveTimeRecords,
    processSaveAndUpdateUI
  };
}

export default useSaveTimeRecords;
