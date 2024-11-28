import React from "react";
import { useSelector } from "react-redux";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ChartContainer } from "./MixedChartStyles";
import { Colors } from "../../styles/AppStyles";

const MixedChart = ({ chartColors }) => {
  const { totalDailyMinutes, categoryData } = useSelector(
    state => state.monthlyStats
  );

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const containerWidth = screenWidth * 0.89;
  const containerHeight = screenHeight * 0.26;

  const { black, white, orange } = Colors;

  // Calculate average daily goal
  const totalGoals = categoryData.reduce(
    (sum, category) => sum + category.dailyGoal,
    0
  );
  const averageDailyGoal = totalGoals / Object.keys(totalDailyMinutes).length;

  const labels = Object.keys(totalDailyMinutes).map(date =>
    new Date(date).toLocaleDateString("en-GB")
  );
  const dailyMinutes = Object.values(totalDailyMinutes);

  const chartData = {
    labels,
    datasets: [
      {
        data: dailyMinutes,
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: new Array(dailyMinutes.length).fill(averageDailyGoal),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Daily Minutes", "Average Daily Goal"]
  };

  return (
    <ChartContainer>
      <LineChart
        data={chartData}
        width={containerWidth}
        height={containerHeight}
        chartConfig={{
          backgroundGradientFrom: white,
          backgroundGradientTo: white,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5
        }}
        style={{
          marginLeft: 0, // Prevents the chart from shifting right
          marginRight: 0,
          paddingLeft: 50,
          paddingRight: 50,
          borderRadius: 10
        }}
      />
    </ChartContainer>
  );
};

export default MixedChart;
