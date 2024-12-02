import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../hooks/api/useFetch";
import { logError, logInfo } from "../../util/logging";
import { roundAllValues } from "../../util/roundingUtils";
import { calculateDailyAverage } from "../../util/calculateDailyAverage";
import { MonthlyStatsColors } from "../../styles/AppStyles";
import { setMonthlyStats } from "../../actions/counterActions";
import { prepareChartData } from "../../util/prepareChartData";

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
        // Round numbers to 0 decimal places by default.
        // Optionally, you can specify the number of decimal places as the second argument.
        const processedData = roundAllValues(receivedData, 0);
        // Format data for charts
        const preparedData = prepareChartData(processedData);

        setRoundedData(preparedData);
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

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  // Calculate derived data and update Redux store
  useEffect(() => {
    if (roundedData) {
      const daysInCurrentMonth = getDaysInMonth(month, year);

      const categoryMonthlyGoals = roundedData.categoryData.map(category => ({
        ...category,
        monthlyGoal: (category.dailyGoal || 55) * daysInCurrentMonth // default 55 minutes
      }));

      const totalDailyMinutes = roundedData.totalDailyMinutes || {};
      const dailyAverageMinutes = calculateDailyAverage(totalDailyMinutes);

      // Ensure categoryData exists before processing
      const totalCategoryMinutesInitialData = roundedData.categoryData
        ? roundedData.categoryData.map(category => category.totalMinutes)
        : []; // Default to an empty array if categoryData is undefined

      // Process totalCategoryMinutes only if there is valid initial data
      const totalCategoryMinutes =
        totalCategoryMinutesInitialData.length === 0
          ? Array(6).fill(0.01) // Default to [0.01, 0.01, 0.01, 0.01, 0.01, 0.01] if no data is available
          : totalCategoryMinutesInitialData.every(min => min === 0)
            ? Array(totalCategoryMinutesInitialData.length).fill(0.01) // Replace all 0s with 1s
            : totalCategoryMinutesInitialData.map(min =>
                min === 0 ? 0.01 : min
              ); // Replace individual 0s with 0.01

      const categoryColors = roundedData.categoryData.map(
        (_, index) =>
          [color1, color2, color3, color4, color5, color6][index % 6]
      );

      const monthlyStatsState = {
        ...roundedData,
        categoryData: categoryMonthlyGoals,
        totalCategoryMinutes,
        categoryColors,
        dailyAverageMinutes: dailyAverageMinutes.averageMinutes || 0.01
      };

      // Dispatch to Redux store
      dispatch(setMonthlyStats(monthlyStatsState));
      console.log(
        "Dispatching monthly stats to Redux:",
        JSON.stringify(monthlyStatsState, null, 2)
      );
    }
  }, [roundedData, month, year, dispatch]);

  // Return the derived data
  return {
    totalMinutes: roundedData?.totalMinutes || 0.01,
    daysWithRecords: roundedData?.daysWithRecords || 0.01,
    dailyAverageMinutes: roundedData?.dailyAverageMinutes || 0.01,
    categoryData: roundedData?.categoryData || [],
    totalCategoryMinutes: roundedData?.totalCategoryMinutes || [0.01],
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
