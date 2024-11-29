import React from "react";
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import { GridContainer, GridItem } from "../DoughnutGrid/DoughnutGridStyles";

const DoughnutGrid = ({ data }) => {
  return (
    <GridContainer>
      {data.map((item, index) => (
        <GridItem key={index}>
          <DoughnutChart
            series={item.series}
            sliceColor={item.sliceColor}
            text={item.text}
          />
        </GridItem>
      ))}
    </GridContainer>
  );
};

export default DoughnutGrid;
