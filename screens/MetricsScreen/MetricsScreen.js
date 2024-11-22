import React, { useContext } from "react";
import { StatusBar, Text, Button, View, ActivityIndicator } from "react-native";
import { CredentialsContext } from "../../context/credentialsContext";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledTitleContainer,
  StyledHeader,
  InfoMessageContainer,
  InfoMessage,
  StyledButton,
  ButtonText,
  Line,
  AvatarContainer,
  IconContainer,
  Avatar,
  MonthlyStatsContainer
} from "./MetricsScreenStyles";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import UpgradeButton from "../../component/UpgradeButton/UpgradeButton";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";
import { logInfo } from "../../util/logging";
import { Colors } from "../../styles/AppStyles";

const {
  seaGreen,
  white,
  infoGrey,
  infoWhite,
  lightPink,
  skyBlue,
  darkGrey,
  black,
  yellow,
  red,
  green
} = Colors;

const screenWidth = Dimensions.get("window").width;

const MetricsScreen = () => {
  const { storedCredentials } = useContext(CredentialsContext);

  const {
    name = "Zen User",
    email = "serenity@gmail.com",
    photoUrl
  } = storedCredentials || {};

  // const AvatarImg = photoUrl
  //   ? { uri: photoUrl }
  //   : require("./../../assets/user.png");

  const AvatarImg = require("./../../assets/user.png");

  const chartData = [
    {
      name: "Example 1",
      population: 40,
      color: green,
      legendFontColor: black,
      legendFontSize: 12
    },
    {
      name: "Example 2",
      population: 60,
      color: skyBlue,
      legendFontColor: black,
      legendFontSize: 12
    }
  ];

  // Get monthly stats from the custom hook
  const {
    totalMinutes,
    categoryCount,
    daysWithRecords,
    totalDailyMinutes,
    categoryData,
    errorMessage,
    isLoading,
    fetchMonthlyStats
  } = useMonthlyStats();

  const upGradeToPremium = () => {
    logInfo("User want to upgrade to premium");
  };

  return (
    <StyledContainer testID="metrics-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <StyledHeader>
          <AvatarContainer testID="avatar-container">
            <Avatar
              resizeMode="cover"
              source={AvatarImg}
              testID="avatar-metrics-image"
            />
          </AvatarContainer>
          <StyledTitleContainer>
            <PageTitle welcome={true} testID="metrics-title">
              Habit Tracker
            </PageTitle>
            <UpgradeButton onPress={upGradeToPremium} />
          </StyledTitleContainer>
          <IconContainer onPress={() => console.log("Pie chart icon clicked!")}>
            <FontAwesome name="pie-chart" size={34} color={infoGrey} />
          </IconContainer>
        </StyledHeader>

        <Line testID="line" />

        <InfoMessageContainer>
          <InfoMessage>
            Please note: This part of the app is still under development. Some
            features may be incomplete or in testing.
          </InfoMessage>
        </InfoMessageContainer>
        <MonthlyStatsContainer style={{ marginTop: 20 }}>
          <SubTitle>Statistics</SubTitle>
          <PieChart
            data={chartData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: white,
              backgroundGradientFrom: white,
              backgroundGradientTo: white,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </MonthlyStatsContainer>
      </InnerContainer>
    </StyledContainer>
  );
};

export default MetricsScreen;
