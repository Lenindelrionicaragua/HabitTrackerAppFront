import React from "react";
import PropTypes from "prop-types";
import {
  MainStatsContainer,
  GridContainer,
  GridItem,
  SubTitle
} from "../DoughnutGrid/DoughnutGridStyles";
import DoughnutChartSmall from "../DoughnutChartSmall/DoughnutChartSmall";

const DoughnutGrid = ({ data }) => {
  return (
    <MainStatsContainer>
      <SubTitle>Goals of the month</SubTitle>
      <GridContainer>
        {data.map((item, index) => (
          <GridItem key={index}>
            <DoughnutChartSmall
              series={item.series}
              sliceColor={item.sliceColor}
              name={item.name}
              progress={item.progress}
            />
          </GridItem>
        ))}
      </GridContainer>
    </MainStatsContainer>
  );
};

DoughnutGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      series: PropTypes.array.isRequired,
      sliceColor: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired
    })
  ).isRequired
};

export default DoughnutGrid;
