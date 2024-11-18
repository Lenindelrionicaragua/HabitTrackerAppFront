import { useEffect } from "react";
import { useSelector } from "react-redux";
import useFetch from "./useFetch";
import { logInfo, logError } from "../../util/logging";

const useSaveDailyRecords = () => {
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

  if (!categoryId) {
    logError("Error: Category ID is missing.");
    return {
      createDailyRecord: () => ({
        success: false,
        error: new Error("Category ID is missing")
      })
    };
  }

  const url = `/time-records/${categoryId}`;
  const { error, performFetch } = useFetch(url, async creationData => {
    if (creationData?.success) {
      logInfo("DailyRecord successfully saved.");
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (error) {
      logError(error);
    }
  }, [error]);

  const createDailyRecord = async () => {
    if (!minutesUpdate || minutesUpdate <= 0) {
      const errMsg = "Error: Minutes update is missing or invalid.";
      logError(errMsg);
      return { success: false, error: new Error(errMsg) };
    }

    try {
      const isSuccessful = await performFetch({
        method: "POST",
        data: { minutesUpdate: minutesUpdate }
      });

      if (!isSuccessful) {
        throw new Error("Failed to save the record.");
      }
      return isSuccessful;
    } catch (error) {
      const errMsg = "Failed to save the record.";
      logError(errMsg);
      return { success: false, error };
    }
  };

  return { createDailyRecord };
};

export default useSaveDailyRecords;
