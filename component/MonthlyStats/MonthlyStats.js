import React from "react";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import {
  SubTitle,
  MonthlyStatsContainer
} from "../../screens/MetricsScreen/MetricsScreenStyles";
import { Colors } from "../../styles/AppStyles";

const { white, black, orange, lightPink, skyBlue, yellow, red, green } = Colors;

const screenWidth = Dimensions.get("window").width;

const MonthlyStats = () => {
  const chartData = [
    {
      name: "Work",
      population: 25,
      color: orange,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Family time",
      population: 20,
      color: lightPink,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Exercise",
      population: 15,
      color: skyBlue,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Screen-free",
      population: 10,
      color: yellow,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Rest",
      population: 20,
      color: red,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Study",
      population: 10,
      color: green,
      legendFontColor: black,
      legendFontSize: 12
    }
  ];

  return (
    <MonthlyStatsContainer style={{ marginTop: 20 }}>
      <SubTitle>Total Minutes</SubTitle>
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
