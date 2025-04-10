import React from "react";
import PropTypes from "prop-types";
import { View, Pressable, Platform } from "react-native";
import { Octicons, Feather } from "@expo/vector-icons";
import {
  StyledInputLabel,
  StyledTextInput,
  LeftIcon,
  RightIcon
} from "../../screens/SignupScreen/SignupScreenStyles";
import { Colors } from "../../styles/AppStyles";

const { darkGrey, black } = Colors;

const iconSize = Platform.OS === "web" ? 22 : 25;
const rightIconSize = Platform.OS === "web" ? 20 : 22;

const TextInputSignupScreen = props => {
  const {
    label,
    icon,
    isPassword,
    hidePassword,
    setHidePassword,
    isDate,
    showDatePicker,
    ...textInputProps
  } = props;

  return (
    <View testID="text-input-signup-screen">
      <LeftIcon testID="left-icon">
        <Octicons name={icon} size={iconSize} color={black} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {!isDate && (
        <StyledTextInput
          testID="styled-text-input-signup-screen"
          {...textInputProps}
        />
      )}
      {isDate && (
        <Pressable onPress={showDatePicker}>
          <StyledTextInput
            testID="styled-date-text-input-signup-screen"
            {...textInputProps}
          />
        </Pressable>
      )}
      {isPassword && (
        <RightIcon
          onPress={() => setHidePassword(!hidePassword)}
          testID="right-icon">
          <Feather
            name={hidePassword ? "eye" : "eye-off"}
            size={rightIconSize}
            color={darkGrey}
          />
        </RightIcon>
      )}
    </View>
  );
};

TextInputSignupScreen.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  isPassword: PropTypes.bool,
  hidePassword: PropTypes.bool,
  setHidePassword: PropTypes.func,
  isDate: PropTypes.bool,
  showDatePicker: PropTypes.func
};

export default TextInputSignupScreen;
