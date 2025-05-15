import React from "react";
import PropTypes from "prop-types";
import { StatusBar, Linking } from "react-native";
import {
  StyledContainer,
  MessageText,
  ButtonGroup,
  StyledButton,
  ButtonText
} from "./SuccessScreenStyles";

const SuccessScreen = ({ navigation, message }) => {
  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <MessageText>{message}</MessageText>
      <ButtonGroup>
        <StyledButton onPress={() => navigation.navigate("WelcomeScreen")}>
          <ButtonText>Ir a versión móvil</ButtonText>
        </StyledButton>
        <StyledButton
          onPress={() =>
            Linking.openURL("https://habit-tracker-app-front.netlify.app")
          }>
          <ButtonText>Ir a versión web</ButtonText>
        </StyledButton>
        <StyledButton
          onPress={() =>
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=com.yourapp"
            )
          }>
          <ButtonText>Descargar la app</ButtonText>
        </StyledButton>
      </ButtonGroup>
    </StyledContainer>
  );
};

SuccessScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  message: PropTypes.string
};

SuccessScreen.defaultProps = {
  message: "¡Cuenta verificada con éxito!"
};

export default SuccessScreen;
