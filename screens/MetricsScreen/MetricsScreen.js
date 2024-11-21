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
  Avatar
} from "./MetricsScreenStyles";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import UpgradeButton from "../../component/UpgradeButton/UpgradeButton";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";
import { logInfo } from "../../util/logging";

const MetricsScreen = ({ showBackArrow = false, navigation }) => {
  const { storedCredentials } = useContext(CredentialsContext);

  const {
    name = "Zen User",
    email = "serenity@gmail.com",
    photoUrl
  } = storedCredentials || {};

  const AvatarImg = photoUrl
    ? { uri: photoUrl }
    : require("./../../assets/logoZenTimer2.png");

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

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <StyledContainer testID="metrics-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <StyledHeader>
          <AvatarContainer size={50} testID="avatar-container">
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
          <FontAwesome name="pie-chart" size={24} color="black" />
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
