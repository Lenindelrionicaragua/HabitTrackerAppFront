import { useCallback } from "react";
import { useDispatch } from "react-redux";
import useFetch from "../hooks/useFetch";
import { setHabitCategories } from "../actions/counterActions";

// Custom hook to fetch monthly stats
const useMonthlyStats = () => {
  const dispatch = useDispatch();

  // Utility to get the current month and year
  const getCurrentMonthAndYear = () => {
    const date = new Date();
    return {
      month: date.getMonth() + 1, // Cambiado a número de mes (1-12)
      year: date.getFullYear() // e.g., 2024
    };
  };

  // Retrieve current month and year
  const { month, year } = getCurrentMonthAndYear();

  // Generate the dynamic URL based on the current month and year
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
