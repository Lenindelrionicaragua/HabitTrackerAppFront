import { useEffect, useState } from "react";
import useFetch from "../../hooks/api/useFetch";
import { logInfo } from "../../util/logging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setHabitCategories,
  setHabitCategoryIndex
} from "../../actions/counterActions";
import { useDispatch, useSelector } from "react-redux";

const useHabitCategories = storedCredentials => {
  const dispatch = useDispatch();
  const habitCategoryIndex = useSelector(
    state => state.habitCategoryIndex.habitCategoryIndex
  );
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Hook to fetch the main categories
  const { data, error, isLoading, performFetch, cancelFetch } = useFetch(
    "/habit-categories",
    async receivedData => {
      if (receivedData.success) {
        const categoriesWithIdAndName = receivedData.categories.map(
          category => ({
            id: category.id,
            name: category.name
          })
        );

        try {
          await AsyncStorage.setItem(
            "habitCategories",
            JSON.stringify(categoriesWithIdAndName)
          );
          dispatch(setHabitCategories(categoriesWithIdAndName));
          logInfo("Categories saved to AsyncStorage:", categoriesWithIdAndName);
        } catch (e) {
          logInfo("Error saving categories to AsyncStorage:", e);
        }
      } else {
        logInfo("No categories found, attempting to auto-create categories.");
        performCreateCategories();
      }
    }
  );

  // Hook to create categories if none are found
  const { performFetch: performCreateCategories } = useFetch(
    "/habit-categories/auto-create-categories",
    async creationData => {
      if (creationData.success) {
        logInfo("Categories successfully auto-created.");
        performFetch(); // Fetch categories again after creation
      } else {
        logInfo("Failed to auto-create categories:", creationData);
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
