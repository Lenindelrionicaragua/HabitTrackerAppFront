import React, { useContext } from "react";
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
import { revokeAsync, useAuthRequest } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";
import axios from "axios";
import { logInfo, logError } from "../../util/logging";

// api url
import { baseApiUrl } from "../../component/Shared/SharedUrl";

// redux-store
import { useSelector, useDispatch } from "react-redux";
import { setActiveScreen } from "../../actions/counterActions";

// Credentials
import {
  EXPO_CLIENT_ID,
  IOS_CLIENT_ID,
  ANDROID_CLIENT_ID,
  WEB_CLIENT_ID
} from "@env";

const WelcomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const activeScreen = useSelector(state => state.activeScreen.activeScreen);
  //Context
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const {
    name = "Zen User",
    email = "serenity@gmail.com",
    photoUrl
  } = storedCredentials || {};

  const AvatarImg = photoUrl
    ? { uri: photoUrl }
    : require("./../../assets/logoZenTimer2.png");

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["profile", "email", "openid"]
  });

  // Google logout function
  const clearLogin = async () => {
    try {
      const token = storedCredentials.token;

      if (token) {
        await revokeAsync(
          { token },
          { revocationEndpoint: `https://oauth2.googleapis.com/revoke` }
        );
      }

      // Clear stored credentials
      await AsyncStorage.removeItem("zenTimerCredentials");
      setStoredCredentials("");
      logInfo("Logout successful");

      Alert.alert(
        "Logout successful",
        "You have been logged out successfully."
      );

      // Server-side logout
      const response = await axios.post(`${baseApiUrl}/auth/log-out`);
      if (response.data.success) {
        logInfo("User successfully logged out");
      } else {
        logError("Logout failed: " + response.data.message);
      }

      // Navigate to login screen and update redux state
      navigation.navigate("LoginScreen");
      dispatch(setActiveScreen("LoginScreen"));
    } catch (error) {
      logError(error);
      Alert.alert("Logout failed", "An error occurred during logout.");
    }
  };

  return (
    <StyledContainer testID="styled-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <WelcomeImage
          resizeMode="cover"
          source={require("./../../assets/ZenTimer6.png")}
          testID="welcome-image"
        />

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
