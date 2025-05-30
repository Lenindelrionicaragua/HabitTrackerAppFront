import React from "react";
import PropTypes from "prop-types";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  MessageText,
  StyledButton,
  ButtonText
} from "./ErrorScreenStyles";

const ErrorScreen = ({ navigation, message }) => {
  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <MessageText>{message}</MessageText>
      <StyledButton onPress={() => navigation.goBack()}>
        <ButtonText>Try Again</ButtonText>
      </StyledButton>
    </StyledContainer>
  );
};

ErrorScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  message: PropTypes.string
};

ErrorScreen.defaultProps = {
  message: "Request failed. Please try again later."
};

export default ErrorScreen;
