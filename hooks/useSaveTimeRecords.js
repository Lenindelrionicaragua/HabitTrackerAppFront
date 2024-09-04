import { useDispatch, useSelector } from "react-redux";
import { logInfo, logError } from "../util/logging";
import {
  setIsRunning,
  setSaveTimeButtonLabel,
  setButtonsDisabled
} from "../actions/counterActions";
import useInfoText from "./useInfoText";
import useUpdateCircleColors from "./useUpdateCircleColors";
import { usePerformReset } from "./usePerformReset";
import { formatTime } from "../util/formatTime";
import { usePlayAlarm } from "./usePlayAlarm";
import { Colors } from "../styles/AppStyles";

function useSaveTimeRecords() {
  const dispatch = useDispatch();
  const performReset = usePerformReset();
  const { updateInfoText, clearTimeoutsAndMessage } = useInfoText();
  const remainingTime = useSelector(state => state.remainingTime.remainingTime);
  const firstRun = useSelector(state => state.firstRun.firstRun);
  const timeCompleted = useSelector(state => state.timeCompleted.timeCompleted);
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);
  const { updateColors } = useUpdateCircleColors();
  const { playAlarm } = usePlayAlarm(logInfo, logError);

  const [alarm, setAlarm] = useState();

  const { green } = Colors;

  const saveTimeRecords = () => {
    clearTimeoutsAndMessage();
    dispatch(setIsRunning(false));

    if (remainingTime === 0 && !firstRun) {
      updateInfoText("No time recorded. Please start the timer before saving.");
      return;
    }

    if ((remainingTime !== 0 && firstRun) || timeCompleted) {
      logInfo(`Remaining time saved: ${formatTime(remainingTime)}`);
      logInfo(`Elapsed time saved: ${formatTime(elapsedTime)}`);
      processSaveAndUpdateUI();
      return;
    }
  };

  const processSaveAndUpdateUI = () => {
    dispatch(setSaveTimeButtonLabel("SAVING"));

    updateInfoText("Saving");
    updateColors(green, green);
    dispatch(setButtonsDisabled(true));

    setTimeout(() => {
      if (!timeCompleted) {
        playAlarm(require("../../assets/alarm_2.wav"));
      }

      performReset();
      updateInfoText(
        "Time saved successfully! Your activity has been recorded."
      );
    }, 6000);
  };

  return {
    saveTimeRecords,
    processSaveAndUpdateUI
  };
}

export default useSaveTimeRecords;
