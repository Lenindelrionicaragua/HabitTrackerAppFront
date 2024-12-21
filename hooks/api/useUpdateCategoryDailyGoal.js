import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logInfo, logError } from "../../util/logging";
import { baseApiUrl } from "../../component/Shared/SharedUrl";

const useUpdateCategoryDailyGoal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const updateCategoryDailyGoal = async (categoryId, newDailyGoal) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let token = await AsyncStorage.getItem("zenTimerToken");

      if (!categoryId) {
        throw new Error("Category ID is required");
      }
      if (newDailyGoal === undefined) {
        throw new Error("New daily goal is required");
      }

      // Validate that the dailyGoal is a valid number and falls within the desired range
      if (isNaN(newDailyGoal) || newDailyGoal < 15 || newDailyGoal > 1440) {
        throw new Error("Daily goal must be between 15 and 1440 minutes.");
      }

      const response = await axios.patch(
        `${baseApiUrl}/habit-categories/${categoryId}/update-daily-goal`,
        { dailyGoal: newDailyGoal },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          withCredentials: true
        }
      );

      // Check for success
      if (response.status === 200) {
        setSuccessMessage("Category daily goal updated successfully!");
        logInfo(
          `Category daily goal updated to: ${JSON.stringify(response.data.category.dailyGoal, null, 2)}`
        );
      } else {
        throw new Error(
          response.data?.message || "Failed to update daily goal"
        );
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      logError("Error updating category daily goal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateCategoryDailyGoal,
    isLoading,
    error,
    successMessage
  };
};

export default useUpdateCategoryDailyGoal;
