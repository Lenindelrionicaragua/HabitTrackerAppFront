import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import PieChart from "react-native-pie-chart";

const DoughnutChart = ({ series, sliceColor, text }) => {
  const screenWidth = Dimensions.get("window").width;
  const widthAndHeight = screenWidth * 0.6;

  return (
    <View style={styles.container}>
      <PieChart
        widthAndHeight={220}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.7}
        coverFill={"#FFF"}
      />
      <View style={styles.textContainer}>
        <Text style={styles.centerText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  },
  centerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000"
  }
});

export default DoughnutChart;
