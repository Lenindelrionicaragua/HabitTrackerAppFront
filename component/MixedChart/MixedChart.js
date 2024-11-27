import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ChartContainer } from "./MixedChartStyles";
import { Colors } from "../../styles/AppStyles";

const MixedChart = ({ categories, recordedMinutes, goals, chartColors }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const containerWidth = screenWidth * 0.92;
  const containerHeight = screenHeight * 0.25;

  const { black, white } = Colors;

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: recordedMinutes,
        color: (opacity = 1) => chartColors.bar, // Bar color
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
          margin: 10,
          borderRadius: 10
        }}
      />
    </ChartContainer>
  );
};

export default MixedChart;
