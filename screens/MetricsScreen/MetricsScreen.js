import React, { useContext } from "react";
import { StatusBar } from "react-native";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  Line,
  MetricsContainer,
  MetricsImage,
  Avatar
} from "./MetricsScreenStyles";

import { CredentialsContext } from "../../context/credentialsContext";

// MetricsScreen component
const MetricsScreen = () => {
  //Context
  const { storedCredentials } = useContext(CredentialsContext);
  const {
    name = "Zen User",
    email = "serenity@gmail.com",
    photoUrl
  } = storedCredentials || {};

  const AvatarImg = photoUrl
    ? { uri: photoUrl }
    : require("./../../assets/logoZenTimer2.png");

  return (
    <StyledContainer testID="metrics-container">
      <StatusBar style="light" />
      <InnerContainer testID="inner-container">
        <MetricsImage
          resizeMode="cover"
          source={require("./../../assets/ZenTimer6.png")}
          testID="metrics-image"
        />

        <MetricsContainer testID="metrics-container">
          <PageTitle welcome={true} testID="metrics-title">
            Your Metrics
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
            {/* Additional content or metrics related UI components can go here */}
          </StyledFormArea>
        </MetricsContainer>
      </InnerContainer>
    </StyledContainer>
  );
};

export default MetricsScreen;
