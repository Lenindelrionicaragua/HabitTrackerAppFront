import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ChartContainer, ChartTitle } from "./MixedChartStyles";

const screenWidth = Dimensions.get("window").width;

const MixedChart = ({ categories, recordedMinutes, goals, chartColors }) => {
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
        width={screenWidth * 0.9}
        height={260}
        chartConfig={{
          backgroundGradientFrom: white,
          backgroundGradientTo: white,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5
        }}
        bezier // Smooth line curve
        style={{
          marginVertical: 10,
          borderRadius: 10
        }}
      />
    </ChartContainer>
  );
};

export default MixedChart;
