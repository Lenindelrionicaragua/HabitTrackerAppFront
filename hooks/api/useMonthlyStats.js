import { useCallback } from "react";
import useFetch from "../../hooks/api/useFetch";
import { logError, logInfo } from "../../util/logging";

// Custom hook to fetch monthly stats
const useMonthlyStats = () => {
  const getCurrentMonthAndYear = () => {
    const date = new Date();
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  };

  const { month, year } = getCurrentMonthAndYear();

  const url = `/habit-categories/monthly-metrics?month=${month}&year=${year}`;

  const { data, error, isLoading, performFetch, cancelFetch } = useFetch(
    url,
    receivedData => {
      if (receivedData.success) {
        logInfo(receivedData.categoryData);
      }
    }
  );

  // Trigger fetch based on button click or other trigger
  const fetchMonthlyStats = useCallback(() => {
    performFetch();
  }, [performFetch]);

  return {
    totalMinutes: data?.totalMinutes || 0,
    categoryCount: data?.categoryCount || 0,
    daysWithRecords: data?.daysWithRecords || 0,
    totalDailyMinutes: data?.totalDailyMinutes || 0,
    categoryData: data?.categoryData || [],
    error,
    isLoading,
    fetchMonthlyStats,
    cancelFetch
  };
};

export default useMonthlyStats;
