import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useFetch from "../hooks/useFetch";
import { setHabitCategories } from "../actions/counterActions";

const useHabitCategories = () => {
  const dispatch = useDispatch();

  const { data, error, isLoading, performFetch, cancelFetch } = useFetch(
    "/habit-categories/",
    receivedData => {
      if (receivedData.success) {
        dispatch(setHabitCategories(receivedData.categories));
      }
    },
    {
      withCredentials: true
    }
  );

  const fetchHabitCategories = useCallback(() => {
    performFetch();
  }, [performFetch]);

  return {
    habitCategories: data?.categories || [],
    error,
    isLoading,
    fetchHabitCategories
  };
};

export default useHabitCategories;
