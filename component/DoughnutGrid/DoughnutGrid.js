import React from "react";
import { GridContainer, GridItem } from "../DoughnutGrid/DoughnutGridStyles";
import DoughnutChartSmall from "../DoughnutChartSmall/DoughnutChartSmall";

const DoughnutGrid = ({ data }) => {
  return (
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
  );
};

export default DoughnutGrid;
