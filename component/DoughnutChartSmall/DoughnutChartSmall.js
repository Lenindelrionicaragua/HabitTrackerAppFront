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
import MonthlyStats from "../MonthlyStats/MonthlyStats";

const { white, black } = Colors;

const DoughnutChartSmall = ({ series, sliceColor, name, progress }) => {
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
        <InfoText>{name}</InfoText>
        <SubText>{progress}</SubText>
      </InfoTextContainer>
    </PieChartContainer>
  );
};

export default DoughnutChartSmall;
