import { useCallback } from "react";
import useFetch from "../../hooks/api/useFetch";
import { logInfo } from "../../util/logging";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useHabitCategories = () => {
  const { data, error, isLoading, performFetch, cancelFetch } = useFetch(
    "/habit-categories",
    async receivedData => {
      if (receivedData.success) {
        // Extract only id and name for each category
        const categoriesWithIdAndName = receivedData.categories.map(
          category => ({
            id: category.id,
            name: category.name
          })
        );

        try {
          // Save the categories to AsyncStorage
          await AsyncStorage.setItem(
            "habitCategories",
            JSON.stringify(categoriesWithIdAndName)
          );
          logInfo("Categories saved to AsyncStorage:", categoriesWithIdAndName);
        } catch (e) {
          logInfo("Error saving categories to AsyncStorage:", e);
        }
      }
    }
  );

  const fetchHabitCategories = useCallback(() => {
    performFetch();
  }, [performFetch]);

  return {
    habitCategories: data?.categories || [],
    message: data?.msg || "",
    error,
    isLoading,
    fetchHabitCategories
  };
};

export default useHabitCategories;
