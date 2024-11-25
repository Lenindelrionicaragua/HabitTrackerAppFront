import React, { useEffect } from "react";
import {
  MonthlyStatsContainer,
  SubTitle,
  InfoText
} from "../../component/MonthlyStats/MonthlyStatsStyles";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";
import { MonthlyStatsColors } from "../../styles/AppStyles";
import DoughnutChart from "../DoughnutChart/DoughnutChart";

// const { white, black } = Colors;
const { color1, color2, color3, color4, color5, color6, color7 } =
  MonthlyStatsColors;
const colorPalette = [color1, color2, color3, color4, color5, color6, color7];

// Get monthly stats from the custom hook
const MonthlyStats = () => {
  const {
    totalMinutes,
    categoryCount,
    daysWithRecords,
    dailyAverageMinutes,
    categoryData,
    series,
    sliceColors,
    errorMessage,
    isLoading,
    fetchMonthlyStats
  } = useMonthlyStats();

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  return (
    <MonthlyStatsContainer>
      <SubTitle>Time distribution</SubTitle>
      <InfoText>
        Days with records: {daysWithRecords} | Daily Average:{" "}
        {dailyAverageMinutes} minutes
      </InfoText>

      <DoughnutChart
        series={series}
        sliceColor={sliceColors}
        text={totalMinutes}
      />
    </MonthlyStatsContainer>
  );
};

export default MonthlyStats;
