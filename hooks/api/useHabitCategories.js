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

          dispatch(setHabitCategories(categoriesWithIdAndName));

          logInfo("Categories saved to AsyncStorage:", categoriesWithIdAndName);
        } catch (e) {
          logInfo("Error saving categories to AsyncStorage:", e);
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
      setCategoriesLoaded(false); // Reset state if credentials are removed
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
