import styled from "styled-components/native";
import { View, Image, Text, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { Colors } from "../../styles/AppStyles";

const {
  seaGreen,
  white,
  infoGrey,
  infoWhite,
  lightPink,
  skyBlue,
  darkGrey,
  black
} = Colors;

const containerHeight = Platform.OS === "web" ? "85%" : "90%";
const containerWidth = Platform.OS === "web" ? "100%" : "100%";
const StyledButtonWidth = Platform.OS === "web" ? "30%" : "90%";

export const StyledContainer = styled(SafeAreaView)`
  background-color: ${darkGrey};
  width: ${containerWidth};
  height: ${containerHeight};
  align-items: ${Platform.OS === "web" ? "center" : "stretch"};
  margin-left: auto;
  margin-right: auto;
`;

export const InnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
  padding-top: 10px;
  justify-content: center;
`;

export const Avatar = styled(Image)`
  width: ${({ size }) => size || 45}px;
  height: ${({ size }) => size || 45}px;
  border-radius: ${({ size }) => (size || 50) / 2}px;
  border-width: ${({ size }) => (size || 50) * 0.04}px;
  overflow: hidden;
  border-width: 2px;
  border-color: ${white};
  background-color: transparent;
  align-items: center;
  justify-content: center;
  box-shadow: none;
`;

export const WelcomeImage = styled(Image)`
  height: 50%;
  width: 100%;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 10px;

  ${props =>
    props.welcome &&
    `
    font-size: 35px;
  `}
`;

export const SubTitle = styled(Text)`
  font-size: 15px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${infoGrey};

  ${props =>
    props.welcome &&
    `
    margin-bottom: 5px;
    font-weight: normal;
  `}
`;

export const StyledFormArea = styled(View)`
  width: 90%;
`;

export const StyledButton = styled(Pressable)`
  padding: 15px;
  background-color: ${black};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;

  ${props =>
    props.google == true &&
    `
    background-color: ${white};
    flex-direction: row;
    justify-content: center;
  `}
`;

export const ButtonText = styled(Text)`
  color: ${seaGreen};
  font-size: 16px;

  ${props =>
    props.google == true &&
    `
    padding: 25px;
    color: ${black}
  `}
`;

export const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${white};
  margin-vertical: 5px;
`;
