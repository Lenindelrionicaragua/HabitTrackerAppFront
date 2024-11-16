import { useEffect } from "react";
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

function useSaveTimeRecords() {
  const dispatch = useDispatch();
  // Store
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const firstRun = useSelector(state => state.firstRun.firstRun);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  // Hooks
  const { updateColors } = useUpdateCircleColors();
  const performReset = usePerformReset();
  const { updateInfoText, clearTimeoutsAndMessage } = useInfoText();
  const { success, errorMessage, message, createDailyRecord } =
    useSaveDailyRecords();
  const { playAlarm } = usePlayAlarm(logInfo, logError);

  const { green, red, skyBlue } = Colors;

  // Convert elapsedTime (seconds) to minutes
  // const minutesUpdate = Math.round((elapsedTime / 60) * 100) / 100;
  // logInfo(`success in useSaveTimeRecords: ${success}`);
  // logInfo(`message in useSaveTimeRecords:${message}`);
  // logInfo(`errorMessage in useSaveTimeRecords: ${errorMessage}`);
  useEffect(() => {
    if (success) {
      updateInfoText(
        message || "Time saved successfully! Your activity has been recorded."
      );
    } else if (success === false) {
      updateColors(red, red);
      updateInfoText(
        errorMessage || "Failed to save the record. Please try again."
      );

      setTimeout(() => {
        clearTimeoutsAndMessage();
        updateColors(skyBlue, skyBlue);
      }, 3000);
    }
  }, [
    success,
    errorMessage,
    message,
    updateInfoText,
    updateColors,
    clearTimeoutsAndMessage
  ]);

  const saveTimeRecords = async () => {
    clearTimeoutsAndMessage();
    dispatch(setIsRunning(false));

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
      const recordSaved = await createDailyRecord();

      if (recordSaved) {
        setTimeout(() => {
          if (!timeCompleted) {
            playAlarm(require("../assets/alarm_2.wav"));
          }

          performReset();
        }, 6000);
      }
    } catch (error) {
      updateInfoText("An error occurred while saving the record.");
    } finally {
      dispatch(setButtonsDisabled(false));
      updateInfoText("Save process completed");
    }
  };

  return {
    saveTimeRecords,
    processSaveAndUpdateUI
  };
}

export default useSaveTimeRecords;
