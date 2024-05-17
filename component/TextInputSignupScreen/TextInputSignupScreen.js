import React from "react";
import { View, Pressable } from "react-native";
import { Octicons, Feather } from "@expo/vector-icons";
import {
  StyledInputLabel,
  StyledTextInput,
  LeftIcon,
  RightIcon
} from "../../screens/SignupScreen/SignupScreenStyles";
import { Colors } from "../../styles/AppStyles";

const { lightGrey, black } = Colors;

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
        <Octicons name={icon} size={30} color={black} />
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
          testID="right-icon"
        >
          <Feather
            name={hidePassword ? "eye" : "eye-off"}
            size={25}
            color={lightGrey}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default TextInputSignupScreen;
