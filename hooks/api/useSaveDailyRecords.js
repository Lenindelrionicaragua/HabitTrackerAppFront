import { useState, useEffect } from "react";
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

  // Hooks
  const { updateInfoText, clearTimeoutsAndMessage } = useInfoText();

  const { error, isLoading, data, performFetch, cancelFetch } = useFetch(
    `/time-records/${categoryId}`,
    async creationData => {
      if (creationData?.success) {
        setMessage("DailyRecord successfully saved.");
        setSuccess(true);
        logInfo("DailyRecord successfully saved.");
        return true;
      }
    }
  );

  useEffect(() => {
    if (!error) return;
    setSuccess(false);
    setErrorMessage(error.message || "An unknown error occurred.");
    logError(`Error: ${error.message}`);
  }, [error]);

  const createDailyRecord = async minutesUpdate => {
    clearTimeoutsAndMessage();

    try {
      const isSuccessful = await performFetch({
        method: "POST",
        data: { minutesUpdate: `${minutesUpdate}` }
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
