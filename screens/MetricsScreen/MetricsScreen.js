import React, { useState, useEffect } from "react";
import { StatusBar, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle
} from "./MetricsScreenStyles";

const MetricsScreen = () => {
  const [storedCredentials, setStoredCredentials] = useState(null);

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
            {/* You can show more data from credentials if available */}
          </>
        ) : (
          <SubTitle welcome={true} testID="page-development">
            No credentials found. Please log in.
          </SubTitle>
        )}
      </InnerContainer>
    </StyledContainer>
  );
};

export default MetricsScreen;
