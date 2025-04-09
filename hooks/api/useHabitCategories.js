import { useEffect, useState } from "react";
import useFetch from "../../hooks/api/useFetch";
import useCreateDefaultCategories from "./useCreateDefaultCategories";
import { logInfo } from "../../util/logging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setHabitCategories,
  setHabitCategoryIndex
} from "../../actions/counterActions";
import { useDispatch } from "react-redux";

const useHabitCategories = storedCredentials => {
  const dispatch = useDispatch();
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  // Hook to create defaultCategories
  const { createCategories } = useCreateDefaultCategories();

  const { data, error, isLoading, performFetch } = useFetch(
    "/habit-categories",
    async receivedData => {
      if (receivedData.success) {
        if (!receivedData.categories || receivedData.categories.length === 0) {
          logInfo("No categories found, attempting to auto-create categories.");
          await createCategories();
        } else {
          const categoriesWithIdAndName = receivedData.categories.map(
            category => ({
              id: category.id,
              name: category.name,
              dailyGoal: category.dailyGoal
            })
          );

          try {
            await AsyncStorage.setItem(
              "habitCategories",
              JSON.stringify(categoriesWithIdAndName)
            );
            dispatch(setHabitCategories(categoriesWithIdAndName));
            logInfo("Categories saved to AsyncStorage");
          } catch (e) {
            logInfo("Error saving categories to AsyncStorage:", e);
          }
        }
      }
    }
  );

  useEffect(() => {
    if (storedCredentials && !categoriesLoaded) {
      logInfo("Fetching categories due to credentials update or initial load.");
      performFetch();
      setCategoriesLoaded(true);
      setHabitCategoryIndex(null);
    } else if (!storedCredentials) {
      setCategoriesLoaded(false);
    }
  }, [storedCredentials, performFetch, categoriesLoaded]);

  return {
    habitCategories: data?.categories || [],
    message: data?.msg || "",
    error,
    isLoading,
    fetchHabitCategories: performFetch
  };
};

export default useHabitCategories;
