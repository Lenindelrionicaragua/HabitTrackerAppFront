import React from "react";
import { Platform } from "react-native";
import PieChart from "react-native-pie-chart";
import {
  PieChartContainer,
  InfoTextContainer,
  InfoText,
  SubText
} from "./DoughnutChartStyles";
import { Colors } from "../../styles/AppStyles";

const { white, black } = Colors;

const DoughnutChart = ({ series, sliceColor, text }) => {
  const widthAndHeight = Platform.OS === "web" ? "200" : "220";

  return (
    <PieChartContainer>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.7}
        coverFill={white}
      />
      <InfoTextContainer>
        <InfoText>{text}</InfoText>
        <SubText>Monthly minutes</SubText>
      </InfoTextContainer>
    </PieChartContainer>
  );
};

export default DoughnutChart;
