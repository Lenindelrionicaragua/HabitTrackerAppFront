import React from "react";
import PropTypes from "prop-types";
import { Platform } from "react-native";
import PieChart from "react-native-pie-chart";
import {
  PieChartContainer,
  InfoTextContainer,
  InfoText,
  SubText
} from "../DoughnutChartSmall/DoughnutChartSmallStyles";
import { Colors } from "../../styles/AppStyles";

const { white } = Colors;

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

DoughnutChartSmall.propTypes = {
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  sliceColor: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default DoughnutChartSmall;
