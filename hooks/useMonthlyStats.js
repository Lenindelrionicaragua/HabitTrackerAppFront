import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useFetch from "../hooks/useFetch";
import { setHabitCategories } from "../actions/counterActions";

const useMonthlyStats = (month, year) => {
  const dispatch = useDispatch();

  // Generate the dynamic URL based on the month and year provided
  const url = `/habit-categories/monthly-metrics?month=${month}&year=${year}`;

  const { data, error, isLoading, performFetch, cancelFetch } = useFetch(
    url,
    receivedData => {
      if (receivedData.success) {
        dispatch(setHabitCategories(receivedData.categories));
      }
    }
  );

  // Trigger fetch based on button click or other trigger
  const fetchMonthlyStats = useCallback(() => {
    performFetch();
  }, [performFetch]);

  return {
    habitCategories: data?.categories || [],
    message: data?.msg || "",
    error,
    isLoading,
    fetchMonthlyStats,
    cancelFetch
  };
};

export default useMonthlyStats;
