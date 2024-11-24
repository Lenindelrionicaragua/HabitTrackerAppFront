import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
// import { PieChart } from "react-native-chart-kit";
import PieChart from "react-native-pie-chart";
import {
  MonthlyStatsContainer,
  SubTitle,
  InfoText
} from "../../component/MonthlyStats/MonthlyStatsStyles";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";
import { Colors, MonthlyStatsColors } from "../../styles/AppStyles";

const { white, black } = Colors;
const { color1, color2, color3, color4, color5, color6, color7 } =
  MonthlyStatsColors;
const screenWidth = Dimensions.get("window").width;

// Get monthly stats from the custom hook
const MonthlyStats = () => {
  const {
    totalMinutes,
    categoryCount,
    daysWithRecords,
    dailyAverageMinutes,
    categoryData,
    errorMessage,
    isLoading,
    fetchMonthlyStats
  } = useMonthlyStats();

  const categoryColors = {
    Work: color1,
    "Family time": color2,
    Exercise: color3,
    "Screen-free": color4,
    Rest: color5,
    Study: color6,
    Yoga: color7
  };

  const chartData = categoryData.map(category => ({
    name: category.name,
    population: category.percentage,
    color: categoryColors[category.name] || color5,
    legendFontColor: black,
    legendFontSize: 12
  }));

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const widthAndHeight = 250;
  const series = [123, 321, 123, 789, 537];
  const sliceColor = ["#fbd203", "#ffb300", "#ff9100", "#ff6c00", "#ff3c00"];

  return (
    <MonthlyStatsContainer>
      <SubTitle>Minutes</SubTitle>
      <InfoText>
        Monthly: {totalMinutes} min | Daily Average: {dailyAverageMinutes}
        min
      </InfoText>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.45}
        coverFill={"#FFF"}
      />
    </MonthlyStatsContainer>
  );
};

export default MonthlyStats;
