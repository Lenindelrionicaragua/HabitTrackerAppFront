import React, { useState, useEffect } from "react";
import { StatusBar, Text, Button, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle
} from "./MetricsScreenStyles";
import useHabitCategories from "../../hooks/useHabitCategories";

const MetricsScreen = () => {
  const [storedCredentials, setStoredCredentials] = useState(null);
  const { habitCategories, error, isLoading, fetchHabitCategories } =
    useHabitCategories();

  // Function to load stored credentials
  const loadCredentials = async () => {
    try {
      const credentials = await AsyncStorage.getItem("zenTimerCredentials");
      if (credentials !== null) {
        setStoredCredentials(JSON.parse(credentials));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      console.log("Error loading credentials", error);
    }
  };

  // Load credentials on screen focus
  useFocusEffect(
    React.useCallback(() => {
      loadCredentials();
    }, [])
  );

  // Initial load on component mount
  useEffect(() => {
    loadCredentials();
  }, []);

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
