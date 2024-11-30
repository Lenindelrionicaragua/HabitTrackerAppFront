import React from "react";

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
              text={item.text}
            />
          </GridItem>
        ))}
      </GridContainer>
    </MainStatsContainer>
  );
};

export default DoughnutGrid;
