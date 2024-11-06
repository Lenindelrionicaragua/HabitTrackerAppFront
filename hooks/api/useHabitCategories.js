import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useFetch from "../../hooks/api/useFetch";
import { setHabitCategories } from "../../actions/counterActions";

const useHabitCategories = () => {
  const dispatch = useDispatch();

  const { data, error, isLoading, performFetch, cancelFetch } = useFetch(
    "/habit-categories",
    receivedData => {
      if (receivedData.success) {
        dispatch(setHabitCategories(receivedData.categories));
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
