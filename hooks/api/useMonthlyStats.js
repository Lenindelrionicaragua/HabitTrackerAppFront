import { useCallback, useEffect, useState } from "react";
import useFetch from "../../hooks/api/useFetch";
import { logError, logInfo } from "../../util/logging";
import { roundAllValues } from "../../util/roundingUtils";

// Custom hook to fetch monthly stats
const useMonthlyStats = () => {
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [roundedData, setRoundedData] = useState(null);

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
        const processedData = roundAllValues(receivedData);
        setRoundedData(processedData);
        logInfo(
          "Monthly stats fetched and rounded successfully.",
          processedData
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
    setRoundedData(null); // Clear previous data before fetching new
    performFetch();
  }, [performFetch]);

  return {
    totalMinutes: roundedData?.totalMinutes || 0,
    categoryCount: roundedData?.categoryCount || 0,
    daysWithRecords: roundedData?.daysWithRecords || 0,
    totalDailyMinutes: roundedData?.totalDailyMinutes || {},
    categoryData: roundedData?.categoryData || [],
    success,
    errorMessage,
    message,
    isLoading,
    fetchMonthlyStats,
    cancelFetch
  };
};

export default useMonthlyStats;
