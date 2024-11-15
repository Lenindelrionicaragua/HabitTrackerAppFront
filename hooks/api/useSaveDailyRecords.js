import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "./useFetch";
import { logInfo, logError } from "../../util/logging";

const useSaveDailyRecords = () => {
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

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
  // logInfo(`category: ${categoryId}`);
  // logInfo(`url: ${url}`);

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

  useEffect(() => {
    if (!error) return;
    setSuccess(false);
    setErrorMessage(error.message || "An unknown error occurred.");
    logError(`Error: ${error.message}`);
  }, [error]);

  const createDailyRecord = async () => {
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
