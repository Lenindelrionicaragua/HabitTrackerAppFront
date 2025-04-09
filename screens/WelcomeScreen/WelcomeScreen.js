import React, { useContext, useEffect } from "react";
import { StatusBar } from "react-native";
import PropTypes from "prop-types";
import {
  StyledContainer,
  InnerContainer,
  Circle,
  StyledHeader,
  StyledUserName,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledButton,
  ButtonText,
  Line,
  Avatar
} from "./WelcomeScreenStyles";
import SyncButton from "../../component/SyncButton/SyncButton";
import HabitCategoryList from "../../component/HabitCategoryList/HabitCategoryList";
import * as Google from "expo-auth-session/providers/google";
import { revokeAsync } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";
import { logInfo, logError } from "../../util/logging";
import useFetch from "../../hooks/api/useFetch";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveScreen,
  resetHabitCategories,
  setHabitCategoryIndex,
  clearMonthlyStats
} from "../../actions/counterActions";
import {
  EXPO_CLIENT_ID,
  IOS_CLIENT_ID,
  ANDROID_CLIENT_ID,
  WEB_CLIENT_ID
} from "@env";

const WelcomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { daysWithRecords } = useSelector(state => state.monthlyStats);
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const { name = "Zen User" } = storedCredentials || {};

  const AvatarImg = require("./../../assets/user.png");

  Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["profile", "email", "openid"]
  });

  // Handler for receiving API responses
  const onReceived = response => {
    const { success, msg } = response;
    if (success) {
      logInfo("User successfully logged out");
      navigation.navigate("LoginScreen");
      dispatch(setActiveScreen("LoginScreen"));
    } else {
      logError(msg);
    }
  };

  // Fetch API for server-side logout request
  const { performFetch, error } = useFetch(`/user/log-out`, onReceived);

  // Handle errors from API calls
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || "An unexpected error occurred.";
      logError(errorMessage);
    }
  }, [error]);

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

      navigation.navigate("LoginScreen");
      dispatch(setActiveScreen("LoginScreen"));
    } catch (error) {
      logError(error);
    }
  };

  return (
    <StyledContainer testID="styled-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <StyledHeader>
          <Circle />
          <StyledUserName>
            <Avatar
              resizeMode="cover"
              source={AvatarImg}
              testID="avatar-image"
            />
            <PageTitle welcome={true} testID="welcome-title">
              {name || "Zen User"}
            </PageTitle>
          </StyledUserName>

          <SubTitle>Days with records: {daysWithRecords}</SubTitle>
          <Line testID="line" />
        </StyledHeader>
        <HabitCategoryList testID="habit-category-component" />

        <SyncButton />

        <StyledFormArea>
          <StyledButton onPress={clearLogin} testID="logout-styled-button">
            <ButtonText testID="logout-button-text">Logout</ButtonText>
          </StyledButton>
        </StyledFormArea>
      </InnerContainer>
    </StyledContainer>
  );
};

WelcomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
};

export default WelcomeScreen;
