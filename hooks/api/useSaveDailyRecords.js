import useFetch from "./useFetch";
import { useState, useEffect } from "react";
import { logInfo, logError } from "../../util/logging";

const useSaveDailyRecords = categoryId => {
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const url = `/time-records/${categoryId}`;

  const { error, isLoading, data, performFetch, cancelFetch } = useFetch(
    url,
    async creationData => {
      if (creationData?.success) {
        setMessage("DailyRecord successfully saved.");
        setSuccess(true);
        logInfo("DailyRecord successfully saved.");
        return true;
      } else {
        setSuccess(false);
        const errMsg = creationData?.message || "An error occurred.";
        setErrorMessage(errMsg);
        logError(`Failed to save dailyRecord: ${errMsg}`);
        return false;
      }
    }
  );

  useEffect(() => {
    if (error) {
      setSuccess(false);
      setErrorMessage(error.message || "An unknown error occurred.");
      logError(`Error: ${error.message}`);
    }
  }, [error]);

  const createDailyRecord = async totalMinutes => {
    try {
      const isSuccessful = await performFetch({
        method: "POST",
        data: { totalMinutes: `${totalMinutes}` }
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
