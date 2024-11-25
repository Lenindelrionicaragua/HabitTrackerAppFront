import { useCallback, useEffect, useState } from "react";
import useFetch from "../../hooks/api/useFetch";
import { logError, logInfo } from "../../util/logging";
import { roundAllValues } from "../../util/roundingUtils";
import { calculateDailyAverage } from "../../util/calculateDailyAverage";
import { MonthlyStatsColors } from "../../styles/AppStyles";

const { color1, color2, color3, color4, color5, color6, color7 } =
  MonthlyStatsColors;

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
        // To change the number of decimals, simply change 0 to the desired number
        const processedData = roundAllValues(receivedData, 0);
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

  // Get the daily average
  const totalDailyMinutes = roundedData?.totalDailyMinutes || {};
  const dailyAverageMinutes = calculateDailyAverage(totalDailyMinutes);

  // Calculate series and colors
  const getSeriesAndColors = () => {
    if (roundedData?.categoryData) {
      const series = roundedData.categoryData.map(
        category => category.totalMinutes
      );
      const sliceColors = roundedData.categoryData.map(
        (_, index) =>
          [color1, color2, color3, color4, color5, color6, color7][index % 7]
      );
      return { series, sliceColors };
    }
    return { series: [], sliceColors: [] };
  };

  const { series, sliceColors } = getSeriesAndColors();

  logInfo(
    `Monthly Stats:: ${JSON.stringify(
      {
        success: true,
        totalMinutes: roundedData?.totalMinutes || 0,
        categoryCount: roundedData?.categoryCount || 0,
        daysWithRecords: roundedData?.daysWithRecords || 0,
        dailyAverageMinutes: dailyAverageMinutes.averageMinutes,
        categoryData: roundedData?.categoryData || [],
        series,
        sliceColors
      },
      null,
      2
    )}`
  );

  return {
    totalMinutes: roundedData?.totalMinutes || 0,
    categoryCount: roundedData?.categoryCount || 0,
    daysWithRecords: roundedData?.daysWithRecords || 0,
    dailyAverageMinutes: dailyAverageMinutes.averageMinutes || 0,
    categoryData: roundedData?.categoryData || [],
    series,
    sliceColors,
    success,
    errorMessage,
    message,
    isLoading,
    fetchMonthlyStats,
    cancelFetch
  };
};

export default useMonthlyStats;
