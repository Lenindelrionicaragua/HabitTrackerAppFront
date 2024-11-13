import useFetch from "./useFetch";
import { logInfo, logError } from "../../util/logging";

const useSaveDailyRecords = categoryId => {
  const url = `/time-records/${categoryId}`;

  const { performFetch } = useFetch(url, async creationData => {
    if (creationData.success) {
      logInfo("DailyRecord successfully saved.");
      return true;
    } else {
      logError("Failed to save dailyRecord:", creationData.message);
      return false;
    }
  });

  const createDailyRecord = async totalMinutes => {
    try {
      const isSuccessful = await performFetch({
        method: "POST",
        data: { totalMinutes: `${totalMinutes}` }
      });
      return isSuccessful;
    } catch (error) {
      logError("Error while saving daily record:", error);
      return false;
    }
  };

  return createDailyRecord, success, fail;
};

export default useSaveDailyRecords;
