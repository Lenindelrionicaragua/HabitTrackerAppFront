import React, { useContext, useEffect } from "react";
import { StatusBar } from "react-native";
import { useSelector } from "react-redux";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledTitleContainer,
  StyledHeader,
  InfoMessageContainer,
  Line,
  AvatarContainer,
  IconContainer,
  Avatar
} from "./MetricsScreenStyles";
import MonthlyStats from "../../component/MonthlyStats/MonthlyStats";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import UpgradeButton from "../../component/UpgradeButton/UpgradeButton";
import { logInfo } from "../../util/logging";
import { Colors } from "../../styles/AppStyles";

const { infoGrey } = Colors;

const MetricsScreen = () => {
  const needsMetricsUpdate = useSelector(
    state => state.metricsUpdateReducer.needsMetricsUpdate
  );
  const AvatarImg = require("./../../assets/user.png");

  const upGradeToPremium = () => {
    logInfo("User want to upgrade to premium");
  };

  useEffect(() => {
    if (needsMetricsUpdate) {
      logInfo("MetricsScreen: Refreshing data");
    }
  }, [needsMetricsUpdate]);

  return (
    <StyledContainer testID="metrics-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <StyledHeader testID="header">
          <AvatarContainer testID="avatar-container">
            <Avatar
              resizeMode="cover"
              source={AvatarImg}
              testID="avatar-metrics-image"
            />
          </AvatarContainer>
          <StyledTitleContainer testID="title-container">
            <PageTitle welcome={true} testID="metrics-title">
              Habit Tracker
            </PageTitle>
            <UpgradeButton onPress={upGradeToPremium} testID="upgrade-button" />
          </StyledTitleContainer>
          <IconContainer
            onPress={() => console.log("Pie chart icon clicked!")}
            testID="pie-chart-icon"
          >
            <FontAwesome name="pie-chart" size={34} color={infoGrey} />
          </IconContainer>
        </StyledHeader>

        <Line testID="line" />
        <SubTitle welcome={true} testID="metrics-title">
          This Month
        </SubTitle>

        <MonthlyStats testID="monthly-stats" />
      </InnerContainer>
    </StyledContainer>
  );
};

export default MetricsScreen;
