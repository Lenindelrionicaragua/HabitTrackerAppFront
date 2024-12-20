import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logInfo, logError } from "../../util/logging";
import { baseApiUrl } from "../../component/Shared/SharedUrl";

const useUpdateCategoryName = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const updateCategoryName = async (categoryId, newName) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let token = await AsyncStorage.getItem("zenTimerToken");

      if (!categoryId) {
        throw new Error("Category ID is required");
      }
      if (!newName) {
        throw new Error("New name is required");
      }

      const response = await axios.patch(
        `${baseApiUrl}/habit-categories/${categoryId}/name`,
        { name: newName },
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
        setSuccessMessage("Category name updated successfully!");
        logInfo("Category name updated:", response.data);
      } else {
        throw new Error(
          response.data?.message || "Failed to update category name"
        );
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      logError("Error updating category name:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateCategoryName,
    isLoading,
    error,
    successMessage
  };
};

export default useUpdateCategoryName;
