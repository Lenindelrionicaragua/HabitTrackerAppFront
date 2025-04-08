import React from "react";
import PropTypes from "prop-types";
import { Platform } from "react-native";
import PieChart from "react-native-pie-chart";
import {
  PieChartContainer,
  InfoTextContainer,
  InfoText,
  SubText
} from "./DoughnutChartStyles";
import { Colors } from "../../styles/AppStyles";

const { white } = Colors;

const DoughnutChart = ({ series, sliceColor, text }) => {
  const widthAndHeight = Platform.OS === "web" ? "160" : "160";

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

DoughnutChart.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  sliceColor: PropTypes.arrayOf(PropTypes.string).isRequired,
  text: PropTypes.string.isRequired
};

export default DoughnutChart;
