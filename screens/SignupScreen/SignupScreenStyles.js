import styled from "styled-components/native";
import { View, Text, TextInput, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { Colors } from "../../styles/AppStyles";

const {
  seaGreen,
  white,
  infoWhite,
  lightPink,
  darkGrey,
  black,
  infoGrey,
  skyBlue,
  lightGreen,
  softGray,
  orange
} = Colors;

const green = "#00ff00";
const red = "#ff0000";

const paddingTop = Platform.OS === "web" ? "0%" : "5%";
const paddingBottom = Platform.OS === "web" ? "5%" : "0%";
const containerHeight = Platform.OS === "web" ? "75%" : "100%";
const containerWidth = Platform.OS === "web" ? "100%" : "100%";

const SubTitleMarginBottom = Platform.OS === "web" ? "0px" : "10px";

const textInputHeight = Platform.OS === "web" ? "45px" : "55px";
const buttonHeight = Platform.OS === "web" ? "45px" : "55px";

const footerPaddingTop = Platform.OS === "web" ? "12px" : "4px";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  padding: 0px;
  background-color: ${orange};
  width: ${containerWidth};
  height: ${containerHeight};

  align-items: ${Platform.OS === "web" ? "center" : "stretch"};
  margin-left: auto;
  margin-right: auto;
`;

export const InnerContainer = styled(View)`
  background-color: ${softGray};
  flex: 1;
  width: 100%;
  padding-top: ${paddingTop};
  padding-bottom: ${paddingBottom};
  align-items: center;
  justify-content: center;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 10px;
`;

export const SubTitle = styled(Text)`
  font-size: 10px;
  margin-bottom: ${SubTitleMarginBottom};
  letter-spacing: 1px;
  font-weight: bold;
  color: ${black};
`;

export const StyledFormArea = styled(View)`
  width: 90%;
`;

export const StyledTextInput = styled(TextInput)`
  background-color: ${white};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: ${textInputHeight};
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${infoGrey};
`;

export const StyledInputLabel = styled(Text)`
  color: ${infoGrey};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled(View)`
  left: 15px;
  top: 40%;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled(Pressable)`
  right: 15px;
  top: 40%;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled(Pressable)`
  background-color: ${black};
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  height: ${buttonHeight};
`;

export const ButtonText = styled(Text)`
  color: ${seaGreen};
  font-size: 15px;
`;

export const MsgBox = styled(Text)`
  text-align: center;
  font-size: 12px;
  padding: 5px;
  color: ${prop => (prop.type === "SUCCESS" ? green : red)};
`;

export const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${white};
  margin-vertical: 10px;
`;

export const FooterView = styled(View)`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding-top: ${footerPaddingTop};
`;

export const FooterText = styled(Text)`
  justify-content: center;
  align-content: center;
  color: ${infoGrey};
  font-size: 15px;
`;

export const FooterLink = styled(Pressable)`
  justify-content: center;
  align-items: center;
`;

export const FooterLinkContent = styled(Text)`
  padding-left: 5px;
  color: ${lightGreen};
  font-size: 15px;
`;
