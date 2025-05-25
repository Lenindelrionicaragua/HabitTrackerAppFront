// EmailVerificationStyles.js
import styled from "styled-components/native";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { seaGreen, white, lightGrey, black, softGray } = Colors;

const containerHeight = Platform.OS === "web" ? "90%" : "85%";
const containerWidth = Platform.OS === "web" ? "100%" : "100%";
const marginTopTopContainer = Platform.OS === "web" ? "80px" : "120px";

export const StyledContainer = styled(SafeAreaView)`
  background-color: ${softGray};
  width: ${containerWidth};
  height: ${containerHeight};
  align-items: ${Platform.OS === "web" ? "center" : "stretch"};
  width: 100%;
`;

export const TopContainer = styled(View)`
  flex: 1;
  justify-content: center;
  padding: 0px;
  margin-top: ${marginTopTopContainer};
  margin-bottom: -20px;
`;

export const IconBackGround = styled(View)`
  width: 250px;
  height: 250px;
  background-color: ${black};
  border-radius: 500px;
  justify-content: center;
  align-items: center;
`;

export const BottomContainer = styled(View)`
  flex: 1;
  justify-content: space-around;
  padding: 20px;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${lightGrey};
  padding: 0px;
`;

export const InfoText = styled(Text)`
  color: ${lightGrey};
  font-size: 15px;
  text-align: center;
`;
