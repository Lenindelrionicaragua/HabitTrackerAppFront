import { useCallback, useEffect, useState } from "react";
import useFetch from "../../hooks/api/useFetch";
import { logError, logInfo } from "../../util/logging";

// Custom hook to fetch monthly stats
const useMonthlyStats = () => {
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

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
        setSuccess(true);
        setMessage("Monthly stats fetched successfully.");
        logInfo(
          "Monthly stats fetched successfully.",
          receivedData.categoryData
        );
      }
    }
  );

  useEffect(() => {
    if (error) {
      setSuccess(false);
      setErrorMessage(
        error.message || "An unknown error occurred while fetching stats."
      );
      logError(`Error fetching monthly stats: ${error.message}`);
    }
  }, [error]);

  const fetchMonthlyStats = useCallback(() => {
    setSuccess(null);
    setMessage("");
    setErrorMessage("");
    performFetch();
  }, [performFetch]);

  return {
    totalMinutes: data?.totalMinutes || 0,
    categoryCount: data?.categoryCount || 0,
    daysWithRecords: data?.daysWithRecords || 0,
    totalDailyMinutes: data?.totalDailyMinutes || {},
    categoryData: data?.categoryData || [],
    success,
    errorMessage,
    message,
    isLoading,
    fetchMonthlyStats,
    cancelFetch
  };
};

export default useMonthlyStats;
