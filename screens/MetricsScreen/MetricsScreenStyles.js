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

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  width: ${containerWidth};
  height: ${containerHeight};
  background-color: ${darkGrey};
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

export const AvatarContainer = styled(View)`
  width: ${({ size }) => size || 50}px;
  height: ${({ size }) => size || 50}px;
  border-radius: ${({ size }) => (size || 50) / 2}px;
  border-width: ${({ size }) => (size || 50) * 0.04}px;
  overflow: hidden;
  border-width: 2px;
  border-color: ${seaGreen};
  background-color: transparent;
  align-items: center;
  justify-content: center;
  box-shadow: none;
`;

export const Avatar = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: transparent;
`;

export const PageTitle = styled(Text)`
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 10px;

  ${props =>
    props.welcome &&
    `
    font-size: 20px;
  `}
`;

export const SubTitle = styled(Text)`
  font-size: 15px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${infoWhite};

  ${props =>
    props.welcome &&
    `
    margin-bottom: 5px;
    font-weight: normal;
  `}
`;

export const InfoMessageContainer = styled(View)`
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const InfoMessage = styled(Text)`
  font-size: 14px;
  text-align: center;
  letter-spacing: 1px;
  color: rgba(128, 128, 128, 0.6);
`;

export const StyledHeader = styled(View)`
  width: 90%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const StyledButton = styled(Pressable)`
  padding: 5px 15px;
  background-color: ${skyBlue};
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  overflow: hidden;
`;

export const ButtonText = styled(Text)`
  color: ${white};
  font-size: 16px;
  transition: color 0.3s ease-in-out;
  ${({ isClicked }) =>
    isClicked &&
    `
    color: yellow; 
  `}
`;

export const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${white};
  margin-vertical: 10px;
`;
