import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useFetch from "../../hooks/api/useFetch";
import { setHabitCategories } from "../../actions/counterActions";
import { logInfo } from "../../util/logging";

const useHabitCategories = () => {
  const dispatch = useDispatch();

  const { data, error, isLoading, performFetch, cancelFetch } = useFetch(
    "/habit-categories",
    receivedData => {
      if (receivedData.success) {
        // Extract only id and name for each category
        const categoriesWithIdAndName = receivedData.categories.map(
          category => ({
            id: category.id,
            name: category.name
          })
        );
        dispatch(setHabitCategories(categoriesWithIdAndName));
        logInfo(categoriesWithIdAndName);
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
