import React, { useEffect } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import PieChart from "react-native-pie-chart";
import {
  MonthlyStatsContainer,
  SubTitle,
  InfoText
} from "../../component/MonthlyStats/MonthlyStatsStyles";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";
import { Colors, MonthlyStatsColors } from "../../styles/AppStyles";
import DoughnutChart from "../DoughnutChart/DoughnutChart";

const { white, black } = Colors;
const { color1, color2, color3, color4, color5, color6, color7 } =
  MonthlyStatsColors;
const screenWidth = Dimensions.get("window").width;
const widthAndHeight = 250;
const series = [123, 321, 123, 789, 537];
const sliceColor = ["#fbd203", "#ffb300", "#ff9100", "#ff6c00", "#ff3c00"];

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
    population: category.totalMinutes,
    color: categoryColors[category.name] || color5,
    legendFontColor: black,
    legendFontSize: 12
  }));

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  return (
    <MonthlyStatsContainer>
      <SubTitle>Minutes</SubTitle>
      <InfoText>Monthly: 1,400 minutes | Daily Average: 40 minutes</InfoText>

      <DoughnutChart series={series} sliceColor={sliceColor} text="40 min" />
    </MonthlyStatsContainer>
  );
};

export default MonthlyStats;
