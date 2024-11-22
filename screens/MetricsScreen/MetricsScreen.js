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
  Avatar
} from "./MetricsScreenStyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import UpgradeButton from "../../component/UpgradeButton/UpgradeButton";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";
import { logInfo } from "../../util/logging";
import { Colors } from "../../styles/AppStyles";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

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

const MetricsScreen = () => {
  const { storedCredentials } = useContext(CredentialsContext);

  const {
    name = "Zen User",
    email = "serenity@gmail.com",
    photoUrl
  } = storedCredentials || {};

  const AvatarImg = photoUrl
    ? { uri: photoUrl }
    : require("./../../assets/user.png");

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
            {/* <FontAwesome5 name="user" size={24} color="black" /> */}
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
        {storedCredentials ? (
          <>
            <SubTitle welcome={true} testID="user-greeting">
              Welcome back, {storedCredentials.name}!
            </SubTitle>
            <Text>Email: {storedCredentials.email}</Text>
          </>
        ) : (
          <SubTitle welcome={true} testID="page-development">
            No credentials found. Please log in.
          </SubTitle>
        )}

        <InfoMessageContainer>
          <InfoMessage>
            Please note: This part of the app is still under development. Some
            features may be incomplete or in testing.
          </InfoMessage>
        </InfoMessageContainer>

        <StyledButton onPress={fetchMonthlyStats}>
          <ButtonText>Fetch Monthly Habit Categories</ButtonText>
        </StyledButton>

        {/* Loading, Error, and Categories Display */}
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {errorMessage && (
          <Text style={{ color: "red" }}>
            Log in to get access to your stats and track your progress.
          </Text>
        )}

        {/* Displaying the overall stats */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Monthly Stats:
          </Text>
          <Text>Total Minutes: {totalMinutes}</Text>
          <Text>Category Count: {categoryCount}</Text>
          <Text>Days with Records: {daysWithRecords}</Text>
          <Text>
            Total Daily Minutes:{" "}
            {Object.keys(totalDailyMinutes).length > 0
              ? Object.entries(totalDailyMinutes)
                  .map(([date, minutes]) => `${date}: ${minutes}`)
                  .join(", ")
              : "No data available"}
          </Text>
        </View>

        {/* Display categories if they exist */}
        {categoryData.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Categories:
            </Text>
            {categoryData.map((category, index) => (
              <Text key={index} style={{ paddingVertical: 5 }}>
                - {category.name}: {category.totalMinutes} minutes (
                {category.percentage}%)
              </Text>
            ))}
          </View>
        )}
      </InnerContainer>
    </StyledContainer>
  );
};

export default MetricsScreen;
