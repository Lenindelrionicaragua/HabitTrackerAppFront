import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logInfo, logError } from "../../util/logging";
import { baseApiUrl } from "../../component/Shared/SharedUrl";

const useSaveCategoryUpdates = () => {
  const saveCategoryUpdates = async ({ id, newName, newDailyGoal }) => {
    try {
      let token = null;
      try {
        token = await AsyncStorage.getItem("zenTimerToken");
      } catch (storageError) {
        logError("Failed to retrieve token", storageError);
      }

      if (!id) throw new Error("Category ID is required");

      const requests = [];

      if (newName) {
        requests.push(
          axios.patch(
            `${baseApiUrl}/api/habit-categories/${id}/name`,
            { name: newName },
            {
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              },
              withCredentials: true
            }
          )
        );
      }

      if (newDailyGoal !== undefined) {
        requests.push(
          axios.patch(
            `${baseApiUrl}/habit-categories/${id}/update-daily-goal`,
            { dailyGoal: newDailyGoal },
            {
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
              },
              withCredentials: true
            }
          )
        );
      }

      const responses = await Promise.allSettled(requests);

      const updatedCategories = responses.map((result, index) => {
        if (result.status === "fulfilled") {
          const responseData = result.value.data;
          if (responseData.success) {
            logInfo(`Request ${index} succeeded:`, responseData.category);
            return responseData.category;
          } else {
            logError(`Request ${index} failed:`, responseData.message);
            return null;
          }
        } else {
          logError(`Request ${index} failed:`, result.reason);
          return null;
        }
      });

      logInfo(`Responses: ${JSON.stringify(responses.map(res => res.data))}`);
      return updatedCategories.filter(category => category !== null);
    } catch (error) {
      logError("Failed to save category updates", error);
      throw error;
    }
  };

  return { saveCategoryUpdates };
};

export default useSaveCategoryUpdates;
