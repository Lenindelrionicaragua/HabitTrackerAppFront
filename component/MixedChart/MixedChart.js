import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ChartContainer } from "./MixedChartStyles";
import { Colors } from "../../styles/AppStyles";

const MixedChart = ({ categories, recordedMinutes, goals, chartColors }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const containerWidth = screenWidth * 0.89;
  const containerHeight = screenHeight * 0.26;

  const { black, white, orange } = Colors;

  const getBarColor = index => chartColors.bar[index];

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: recordedMinutes,
        color: (opacity = 1, index) => getBarColor(index), // Bar color
        strokeWidth: 2
      },
      {
        data: goals,
        color: (opacity = 1) => chartColors.line, // Line color
        strokeWidth: 2
      }
    ],
    legend: ["Recorded Minutes", "Monthly Goals"]
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
