import React from "react";
import { Platform } from "react-native";
import PieChart from "react-native-pie-chart";
import {
  PieChartContainer,
  InfoTextContainer,
  InfoText,
  SubText
} from "../DoughnutChartSmall/DoughnutChartSmallStyles";
import { Colors } from "../../styles/AppStyles";

const { white, black } = Colors;

const DoughnutChartSmall = ({ series, sliceColor, text }) => {
  const widthAndHeight = Platform.OS === "web" ? "80" : "80";

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

export default DoughnutChartSmall;
