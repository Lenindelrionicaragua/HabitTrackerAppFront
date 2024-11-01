import React, { useEffect } from "react";
import { StatusBar, Text, Button, View, ActivityIndicator } from "react-native";
import { useContext } from "react";
import { CredentialsContext } from "../../context/credentialsContext"; // Import your context
import { useFocusEffect } from "@react-navigation/native";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle
} from "./MetricsScreenStyles";
import useHabitCategories from "../../hooks/useHabitCategories";

const MetricsScreen = () => {
  const { storedCredentials } = useContext(CredentialsContext); // Use context to access stored credentials
  const { habitCategories, error, isLoading, fetchHabitCategories } =
    useHabitCategories();

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
            onPress={fetchHabitCategories}
            title="Fetch Habit Categories"
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

        {habitCategories.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Categories:
            </Text>
            {habitCategories.map(category => (
              <Text key={category.id} style={{ paddingVertical: 5 }}>
                - {category.name} (Created At:{" "}
                {new Date(category.createdAt).toLocaleDateString()})
              </Text>
            ))}
          </View>
        )}
      </InnerContainer>
    </StyledContainer>
  );
};

export default MetricsScreen;
