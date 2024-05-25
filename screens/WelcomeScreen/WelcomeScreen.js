import React, { useContext } from "react";
import { StatusBar } from "react-native";

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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../../context/credentialsContext";
import { logError } from "../../util/logging";

const WelcomeScreen = () => {
  //Context
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { name, email, photoUrl } = storedCredentials;
  const AvatarImg = photoUrl
    ? { uri: photoUrl }
    : require("./../../assets/logoZenTimer2.png");

  const clearLogin = () => {
    AsyncStorage.removeItem("zenTimerCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch(error => logError(error));
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
