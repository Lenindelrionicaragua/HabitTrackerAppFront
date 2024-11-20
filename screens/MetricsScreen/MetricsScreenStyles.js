import styled from "styled-components/native";
import { View, Image, Text, Pressable, Platform } from "react-native";
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
const containerWidth = Platform.OS === "web" ? "100%" : "100%";

const textInputHeight = Platform.OS === "web" ? "50px" : "60px";
const buttonHeight = Platform.OS === "web" ? "50px" : "60px";

const SubTitleMarginBottom = Platform.OS === "web" ? "0px" : "10px";

const lineMarginVertical = Platform.OS === "web" ? "5px" : "10px";
const footerPaddingTop = Platform.OS === "web" ? "15px" : "15px";

export const StyledContainer = styled(
  Platform.OS === "web" ? View : SafeAreaView
)`
  flex: 1;
  padding: 15px;
  background-color: ${darkGrey};
  width: ${containerWidth};
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
`;

export const PageLogo = styled(Image)`
  width: 160px;
  height: 160px;
  border-radius: 80px;
  overflow: hidden;
`;

export const PageTitle = styled(Text)`
  font-size: 25px;
  justify: left;
  text-align: left;
  font-weight: bold;
  color: ${black};
  padding: 10px;
`;

export const SubTitle = styled(Text)`
  font-size: 10px;
  margin-bottom: ${SubTitleMarginBottom};
  letter-spacing: 1px;
  font-weight: bold;
  color: ${infoGrey};
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
  margin-vertical: ${lineMarginVertical}x;
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
