import React from "react";
import { View, Platform } from "react-native";
import { Octicons, Feather } from "@expo/vector-icons";
import {
  StyledInputLabel,
  StyledTextInput,
  LeftIcon,
  RightIcon
} from "../../screens/LoginScreen/LoginScreenStyles";
import { Colors } from "../../styles/AppStyles";

const { darkGrey, black } = Colors;

const iconSize = Platform.OS === "web" ? 25 : 30;
const rightIconSize = Platform.OS === "web" ? 20 : 25;

const TextInputLoginScreen = props => {
  const {
    label,
    icon,
    isPassword,
    hidePassword,
    setHidePassword,
    ...textInputProps
  } = props;

  return (
    <View testID="text-input-login-screen">
      <LeftIcon testID="left-icon">
        <Octicons
          name={icon}
          size={iconSize}
          color={black}
          testID="octicons-icon"
        />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput
        testID="styled-text-input-login-screen"
        {...textInputProps}
      />
      {isPassword && (
        <RightIcon
          onPress={() => setHidePassword(!hidePassword)}
          testID="right-icon"
        >
          <Feather
            name={hidePassword ? "eye" : "eye-off"}
            size={rightIconSize}
            color={darkGrey}
            onPress={() => setHidePassword(!hidePassword)}
            testID="feather-icon"
          />
        </RightIcon>
      )}
    </View>
  );
};

export default TextInputLoginScreen;
