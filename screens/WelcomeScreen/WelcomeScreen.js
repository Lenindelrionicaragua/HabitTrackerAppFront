import React, { useContext, useEffect, useState } from "react";
import { StatusBar, Alert } from "react-native";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  Line,
  WelcomeContainer,
  WelcomeImage,
  Avatar
} from "./WelcomeScreenStyles";

import * as Google from "expo-auth-session/providers/google";
import { revokeAsync } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";
import { logInfo, logError } from "../../util/logging";

// Hooks for data fetching
import useFetch from "../../hooks/api/useFetch";
// Redux store
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveScreen,
  resetHabitCategories,
  setHabitCategoryIndex,
  clearMonthlyStats
} from "../../actions/counterActions";

// Credentials
import {
  EXPO_CLIENT_ID,
  IOS_CLIENT_ID,
  ANDROID_CLIENT_ID,
  WEB_CLIENT_ID
} from "@env";

const WelcomeScreen = ({ navigation }) => {
  // Redux store
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.activeScreen.activeScreen);
  const habitCategoryIndex = useSelector(
    state => state.habitCategoryIndex.habitCategoryIndex
  );
  // Context
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const [token, setToken] = useState(null);
  // Local state
  const [msg, setMsg] = useState("");
  const [success, setSuccessStatus] = useState("");

  const {
    name = "Zen User",
    email = "serenity@gmail.com",
    photoUrl
  } = storedCredentials || {};

  const AvatarImg = photoUrl
    ? { uri: photoUrl }
    : require("./../../assets/user.png");

  // Google authentication setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["profile", "email", "openid"]
  });

  // Handler for receiving API responses
  const onReceived = response => {
    const { success, msg, user } = response;
    if (success) {
      logInfo("User successfully logged out");
      navigation.navigate("LoginScreen");
      dispatch(setActiveScreen("LoginScreen"));
    } else {
      logInfo(msg);
      handleMessage({ successStatus: false, msg });
    }
  };

  // Fetch API for server-side logout request
  const { performFetch, isLoading, error } = useFetch(
    `/user/log-out`,
    onReceived
  );

  // Handle errors from API calls
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || "An unexpected error occurred.";
      handleMessage({ successStatus: false, msg: errorMessage });
    }
  }, [error]);

  // Update message box based on success or error
  const handleMessage = ({ successStatus, msg }) => {
    setSuccessStatus(successStatus);
    setMsg(msg);
  };

  const revokeGoogleToken = async token => {
    await revokeAsync(
      { token },
      { revocationEndpoint: `https://oauth2.googleapis.com/revoke` }
    );
    logInfo("Google token revoked successfully");
  };

  const clearStorage = async () => {
    await AsyncStorage.multiRemove([
      "zenTimerUser",
      "zenTimerToken",
      "habitCategories"
    ]);
    dispatch(resetHabitCategories());
    dispatch(clearMonthlyStats());
    dispatch(setHabitCategoryIndex(null));
    setStoredCredentials(null);
    logInfo("User, token, and categories cleared from storage");
  };

  const performServerLogout = async () => {
    try {
      performFetch({ method: "POST" });
    } catch (error) {
      logError("Error logging out from server", error);
    }
  };

  // Function to handle clearing user login and logout
  const clearLogin = async () => {
    try {
      await performServerLogout();

      const token = storedCredentials?.token;
      if (token) {
        await revokeGoogleToken(token);
      }

      await clearStorage();

      Alert.alert(
        "Logout successful",
        "You have been logged out successfully."
      );
      navigation.navigate("LoginScreen");
      dispatch(setActiveScreen("LoginScreen"));
    } catch (error) {
      logError(error);
      Alert.alert("Logout error", "There was an error logging out.");
    }
  };

  return (
    <StyledContainer testID="styled-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <WelcomeContainer testID="welcome-container">
          <PageTitle welcome={true} testID="welcome-title">
            Welcome!
          </PageTitle>
          <SubTitle welcome={true} testID="user-name">
            {name || "Zen User"}
          </SubTitle>
          <SubTitle welcome={true} testID="user-email">
            {email || "serenity@gmail.com"}
          </SubTitle>
          <StyledFormArea>
            <Avatar
              resizeMode="cover"
              source={AvatarImg}
              testID="avatar-image"
            />
            <Line testID="line" />
            <StyledButton onPress={clearLogin} testID="logout-styled-button">
              <ButtonText testID="logout-button-text">Logout</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </WelcomeContainer>
      </InnerContainer>
    </StyledContainer>
  );
};

export default WelcomeScreen;
