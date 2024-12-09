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
  black,
  softGray,
  orange,
  green,
  red
} = Colors;

const containerHeight = Platform.OS === "web" ? "90%" : "90%";
const containerWidth = Platform.OS === "web" ? "100%" : "100%";
const paddingTop = Platform.OS === "web" ? "0%" : "5%";
const paddingBottom = Platform.OS === "web" ? "5%" : "0%";

export const StyledContainer = styled(SafeAreaView)`
  background-color: ${softGray};
  width: ${containerWidth};
  height: ${containerHeight};
  align-items: ${Platform.OS === "web" ? "center" : "stretch"};
  margin-left: auto;
  margin-right: auto;
`;

export const InnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  padding-bottom: ${paddingBottom};
  align-items: center;
  justify-content: center;
`;

export const Circle = styled(View)`
  position: absolute;
  top: -70px;
  left: -80px;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: ${seaGreen};
`;

export const StyledHeader = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px 0px 0px 0px;
  overflow: hidden;
`;

export const StyledUserName = styled(View)`
  width: 100%;
  flex-direction: row;
  padding: 0px 0px 0px 20px;
  align-items: center;
`;

export const Avatar = styled(Image)`
  width: ${({ size }) => size || 60}px;
  height: ${({ size }) => size || 60}px;
  border-radius: ${({ size }) => (size || 60) / 2}px;
  border-width: ${({ size }) => (size || 50) * 0.04}px;
  overflow: hidden;
  border-width: 2px;
  border-color: ${white};
  background-color: transparent;
  align-items: center;
  justify-content: center;
  box-shadow: none;
`;

export const PageTitle = styled(Text)`
  font-size: 10px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 0px 15px;

  ${props =>
    props.welcome &&
    `
    font-size: 20px;
  `}
`;

export const SubTitle = styled(Text)`
  font-size: 12px;
  text-align: left;
  padding-left: 95px;
  padding-vertical: 3px;
  letter-spacing: 1px;
  color: ${darkGrey};
`;

export const StyledFormArea = styled(View)`
  width: 90%;
`;

export const CategoryContainer = styled(View)`
  flex: 1;
  padding: 10px;
  background-color: ${softGray};
`;

export const CategoryCard = styled(View)`
  background-color: ${white};
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  shadow-color: ${darkGrey};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  width: 100%;
  justify-content: flex-start;
`;

export const CategoryTitle = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${black};
`;

export const CategoryGoal = styled(Text)`
  font-size: 14px;
  color: ${darkGrey};
  margin-top: 5px;
`;

export const CategoryListWrapper = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: column;
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
  color: ${white};
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
  shadow-color: ${infoGrey};
  shadow-opacity: 0.5;
  shadow-radius: 2px;
  elevation: 2;
`;
