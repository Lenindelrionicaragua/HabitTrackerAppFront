import React from "react";
import { StatusBar } from "react-native";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle
} from "./MetricsScreenStyles";

const MetricsScreen = () => {
  return (
    <StyledContainer testID="metrics-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <PageTitle welcome={true} testID="metrics-title">
          Metrics Page
        </PageTitle>
        <SubTitle welcome={true} testID="page-development">
          This page is currently under development.
        </SubTitle>
      </InnerContainer>
    </StyledContainer>
  );
};

export default MetricsScreen;
