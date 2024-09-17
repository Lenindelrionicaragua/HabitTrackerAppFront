import styled from "styled-components/native";
import {
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  Platform
} from "react-native";
import { Colors } from "../../styles/AppStyles";
import { SafeAreaView } from "react-native";

const {
  seaGreen,
  white,
  infoGrey,
  lightPink,
  darkGrey,
  black,
  skyBlue,
  lightGreen
} = Colors;

const green = "#00ff00";
const red = "#ff0000";

const paddingTop = Platform.OS === "web" ? "7%" : "0%";
const paddingBottom = Platform.OS === "web" ? "10%" : "10%";
const containerHeight = Platform.OS === "web" ? "80%" : "100%";
const containerWidth = Platform.OS === "web" ? "50%" : "100%";

const textInputHeight = Platform.OS === "web" ? "50px" : "60px";
const buttonHeight = Platform.OS === "web" ? "50px" : "60px";

const SubTitleMarginBotton = Platform.OS === "web" ? "0px" : "10px";
const footerPaddingTop = Platform.OS === "web" ? "10px" : "15px";

export const StyledContainer = styled(
  Platform.OS === "web" ? View : SafeAreaView
)`
  flex: 1;
  background-color: ${darkGrey};
  width: ${containerWidth};
  padding: 15px;
  height: ${containerHeight};
  margin-top: ${paddingTop};
  margin-bottom: ${paddingBottom};
  align-items: ${Platform.OS === "web" ? "center" : "stretch"};
  margin-left: auto;
  margin-right: auto;
`;

export const InnerContainer = styled(View)`
  background-color: ${darkGrey};
  flex: 1;
  padding-top: 15px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const PageLogo = styled(Image)`
  width: 160px;
  height: 160px;
  border-radius: 80px;
  overflow: hidden;
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
  margin-bottom: ${SubTitleMarginBotton};
  letter-spacing: 1px;
  font-weight: bold;
  color: ${infoGrey};
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
  position: relative;
  z-index: 0;
`;

export const StyledInputLabel = styled(Text)`
  color: ${infoGrey};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled(View)`
  position: absolute;
  left: 15px;
  top: 40%;
  z-index: 1;
`;

export const RightIcon = styled(Pressable)`
  position: absolute;
  right: 15px;
  top: 40%;
  z-index: 1;
`;

export const StyledButton = styled(Pressable)`
  padding: 15px;
  background-color: ${black};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: ${buttonHeight};

  ${props =>
    props.google == true &&
    `
    background-color: ${white};
    flex-direction: row;
    justify-content: center;
  `}
`;

export const ButtonText = styled(Text)`
  color: ${props => (props.google ? black : seaGreen)};
  font-size: 16px;

  ${props =>
    props.google == true &&
    `
    padding-left: 15px;
  `}
`;

export const MsgBox = styled(Text)`
  text-align: center;
  font-size: 13px;
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
  padding: 10px;
  padding-top: ${footerPaddingTop};
`;

export const FooterText = styled(Text)`
  justify-content: center;
  align-content: center;
  color: ${infoGrey};
  font-size: 15px;
`;

export const SignupLink = styled(Pressable)`
  justify-content: center;
  align-items: center;
`;

export const SignupLinkContent = styled(Text)`
  color: ${lightPink};
  font-size: 15px;
`;
