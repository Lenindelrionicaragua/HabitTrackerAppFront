import { useState } from "react";
import { useSelector } from "react-redux";
import useFetch from "./useFetch";
import { logInfo, logError } from "../../util/logging";
import { useHandleError } from "../useHandleError";

const useSaveDailyRecords = () => {
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  // Hooks

  // Store
  const habitCategoryIndex = useSelector(
    state => state.habitCategoryIndex.habitCategoryIndex
  );
  const habitCategories = useSelector(
    state => state.habitCategories.habitCategories
  );
  const categoryId =
    habitCategoryIndex !== null
      ? habitCategories?.[habitCategoryIndex]?.id
      : null;
  const elapsedTime = useSelector(state => state.elapsedTime.elapsedTime);

  const minutesUpdate = Math.round((elapsedTime / 60) * 100) / 100;

  const url = categoryId ? `/time-records/${categoryId}` : `/time-records/"}`;
  logInfo(`category: ${categoryId}`);
  logInfo(`url: ${url}`);

  // logInfo(`success in useSaveDailyRecords: ${success}`);
  // logInfo(`message in useSaveDailyRecords:${message}`);
  // logInfo(`errorMessage in useSaveDailyRecords: ${errorMessage}`);

  const { error, isLoading, data, performFetch, cancelFetch } = useFetch(
    url,
    async creationData => {
      if (creationData?.success) {
        setMessage("DailyRecord successfully saved.");
        setSuccess(true);
        logInfo("DailyRecord successfully saved.");
        return true;
      }
      return false;
    }
  );

  const { resetErrorState } = useHandleError(
    error,
    setSuccess,
    setErrorMessage
  );

  const createDailyRecord = async () => {
    resetErrorState();
    logInfo(`minuts in the call: ${minutesUpdate}`);
    logInfo(`errorMessage: ${errorMessage}`);
    try {
      const isSuccessful = await performFetch({
        method: "POST",
        data: { minutesUpdate: minutesUpdate }
      });
      return isSuccessful;
    } catch (error) {
      setSuccess(false);
      const errMsg = "Failed to save the record.";
      setErrorMessage(errMsg);
      logError(errMsg);
      return false;
    }
  };

  return { success, errorMessage, message, createDailyRecord };
};

export default useSaveDailyRecords;
