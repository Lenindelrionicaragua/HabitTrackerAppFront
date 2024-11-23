import React, { useEffect } from "react";
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
