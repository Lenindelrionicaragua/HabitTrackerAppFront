import React, { useContext } from "react";
import { StatusBar, Text, Button, View, ActivityIndicator } from "react-native";
import { CredentialsContext } from "../../context/credentialsContext";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle
} from "./MetricsScreenStyles";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";

const MetricsScreen = () => {
  const { storedCredentials } = useContext(CredentialsContext);

  // Get monthly stats from the custom hook
  const {
    totalMinutes,
    categoryCount,
    daysWithRecords,
    totalDailyMinutes,
    categoryData,
    error,
    isLoading,
    fetchMonthlyStats
  } = useMonthlyStats();

  return (
    <StyledContainer testID="metrics-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <PageTitle welcome={true} testID="metrics-title">
          Metrics Page
        </PageTitle>

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

        {/* Fetch Habit Categories Button */}
        <View style={{ marginVertical: 20 }}>
          <Button
            onPress={fetchMonthlyStats} // This triggers the stats fetch
            title="Fetch Monthly Habit Categories"
            disabled={isLoading}
          />
        </View>

        {/* Loading, Error, and Categories Display */}
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && (
          <Text style={{ color: "red" }}>
            Error fetching categories: {error.message}
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
          <Text>Total Daily Minutes: {totalDailyMinutes}</Text>
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
