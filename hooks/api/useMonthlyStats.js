import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../hooks/api/useFetch";
import { logError, logInfo } from "../../util/logging";
import { roundAllValues } from "../../util/roundingUtils";
import { calculateDailyAverage } from "../../util/calculateDailyAverage";
import { MonthlyStatsColors } from "../../styles/AppStyles";
import { setMonthlyStats } from "../../actions/counterActions";

const { color1, color2, color3, color4, color5, color6 } = MonthlyStatsColors;

const useMonthlyStats = storedCredentials => {
  const dispatch = useDispatch();

  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [roundedData, setRoundedData] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const getCurrentMonthAndYear = () => {
    const date = new Date();
    return {
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  };

  const { month, year } = getCurrentMonthAndYear();
  const url = `/habit-categories/monthly-metrics?month=${month}&year=${year}`;

  const { error, isLoading, performFetch, cancelFetch } = useFetch(
    url,
    receivedData => {
      if (receivedData.success) {
        setSuccess(true);
        setMessage("Monthly stats fetched successfully.");
        const processedData = roundAllValues(receivedData, 0);
        setRoundedData(processedData);
      }
    }
  );

  useEffect(() => {
    if (storedCredentials) {
      setHasFetched(false);
    }
  }, [storedCredentials]);

  // Fetch categories when stored credentials are available
  useEffect(() => {
    if (storedCredentials && !hasFetched) {
      logInfo("Fetching categories due to credentials update or initial load.");
      performFetch();
      setHasFetched(true);
    }
  }, [storedCredentials, hasFetched, performFetch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setSuccess(false);
      setErrorMessage(
        error.message || "An unknown error occurred while fetching stats."
      );
      logError(`Error fetching monthly stats: ${error.message}`);
    }
  }, [error]);

  // Calculate derived data and update Redux store
  useEffect(() => {
    if (roundedData) {
      const totalDailyMinutes = roundedData.totalDailyMinutes || {};
      const dailyAverageMinutes = calculateDailyAverage(totalDailyMinutes);

      const categoryMinutes = roundedData.categoryData.map(
        category => category.totalMinutes
      );
      const categoryColors = roundedData.categoryData.map(
        (_, index) =>
          [color1, color2, color3, color4, color5, color6][index % 6]
      );

      const monthlyStatsState = {
        ...roundedData,
        categoryMinutes,
        categoryColors,
        dailyAverageMinutes: dailyAverageMinutes.averageMinutes || 0
      };

      // Dispatch to Redux store
      dispatch(setMonthlyStats(monthlyStatsState));
      console.log(
        "Dispatching monthly stats to Redux:",
        JSON.stringify(monthlyStatsState, null, 2)
      );
    }
  }, [roundedData, dispatch]);

  // Return the derived data
  return {
    totalMinutes: roundedData?.totalMinutes || 0,
    categoryCount: roundedData?.categoryCount || 0,
    daysWithRecords: roundedData?.daysWithRecords || 0,
    dailyAverageMinutes: roundedData?.dailyAverageMinutes || 0,
    categoryData: roundedData?.categoryData || [],
    categoryMinutes: roundedData?.categoryMinutes || [1],
    categoryColors: roundedData?.categoryColors || ["#bbcbde"],
    success,
    errorMessage,
    message,
    isLoading,
    fetchMonthlyStats: performFetch,
    cancelFetch
  };
};

export default useMonthlyStats;
