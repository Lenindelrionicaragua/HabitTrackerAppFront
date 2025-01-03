import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { logInfo, logError } from "../../util/logging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseApiUrl } from "../../component/Shared/SharedUrl";

const useSaveDailyRecords = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const createDailyRecord = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let token = null;
      try {
        token = await AsyncStorage.getItem("zenTimerToken");
      } catch (storageError) {
        logError("Failed to retrieve token", storageError);
      }

      const response = await axios.post(
        `${baseApiUrl}/api/time-records/${categoryId}`,
        { minutesUpdate },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          withCredentials: true
        }
      );

      logInfo(`Response Data: ${JSON.stringify(response.data)}`);

      if (response.data.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(
          response.data.error || response.data.msg || "Unexpected server error"
        );
      }
    } catch (error) {
      const normalizedError = new Error(
        error.response?.data?.msg || error.message || "Unknown error"
      );
      logError("Failed to save the record", normalizedError);
      setError(normalizedError);
      return { success: false, error: normalizedError };
    } finally {
      setIsLoading(false);
    }
  };

  return { createDailyRecord, isLoading, error };
};

export default useSaveDailyRecords;
