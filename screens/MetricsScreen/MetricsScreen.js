import React, { useContext } from "react";
import { StatusBar, Text, Button, View, ActivityIndicator } from "react-native";
import { CredentialsContext } from "../../context/credentialsContext";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledHeader,
  Line,
  AvatarContainer,
  Avatar
} from "./MetricsScreenStyles";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";

const MetricsScreen = () => {
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
          <PageTitle welcome={true} testID="metrics-title">
            Habit Tracker
          </PageTitle>
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

        {/* Add a notice about the app being in development */}
        <View
          style={{
            padding: 10,
            backgroundColor: "#f9f9f9",
            borderRadius: 5,
            marginBottom: 10
          }}
        >
          <Text style={{ fontSize: 14, color: "gray", textAlign: "center" }}>
            Please note: This part of the app is still under development. Some
            features may be incomplete or in testing.
          </Text>
        </View>

        {/* Fetch Habit Categories Button */}
        <View style={{ marginVertical: 10 }}>
          <Button
            onPress={fetchMonthlyStats} // This triggers the stats fetch
            title="Fetch Monthly Habit Categories"
            disabled={isLoading}
          />
        </View>

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
