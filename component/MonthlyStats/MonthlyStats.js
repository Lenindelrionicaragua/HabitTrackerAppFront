import React from "react";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
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

// const containerWidth = Platform.OS === "web" ? "400px" : "400px";

const MonthlyStats = () => {
  const chartData = [
    {
      name: "Rest",
      population: 20,
      color: color5,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Family time",
      population: 20,
      color: color2,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Screen-free",
      population: 10,
      color: color4,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Work",
      population: 25,
      color: color1,
      legendFontColor: black,
      legendFontSize: 12
    },

    {
      name: "Exercise",
      population: 15,
      color: color3,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Yoga",
      population: 10,
      color: color7,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Study",
      population: 10,
      color: color6,
      legendFontColor: black,
      legendFontSize: 12
    }
  ];

  // Get monthly stats from the custom hook
  const {
    totalMinutes,
    categoryCount,
    daysWithRecords,
    totalDailyMinutes,
    categoryData,
    errorMessage,
    isLoading,
    fetchMonthlyStats
  } = useMonthlyStats();

  return (
    <MonthlyStatsContainer>
      <SubTitle>This Month</SubTitle>
      <InfoText>Total Minutes: 1,400 | Daily Average: 40</InfoText>

      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: white,
          backgroundGradientFrom: white,
          backgroundGradientTo: white,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </MonthlyStatsContainer>
  );
};

export default MonthlyStats;
