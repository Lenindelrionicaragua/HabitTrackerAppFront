import styled from "styled-components/native";
import { SafeAreaView, View, Text, Platform } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { softGray, lightGrey, black } = Colors;

const containerHeight = Platform.OS === "web" ? "90%" : "85%";
const containerWidth = Platform.OS === "web" ? "100%" : "100%";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${softGray};
  width: ${containerWidth};
  height: ${containerHeight};
  align-items: center;
`;

export const TopContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
`;

export const IconBackGround = styled(View)`
  width: 200px;
  height: 200px;
  background-color: ${black};
  border-radius: 100px;
  justify-content: center;
  align-items: center;
`;

export const BottomContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const PageTitle = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: ${lightGrey};
  margin-bottom: 15px;
`;

export const InfoText = styled(Text)`
  font-size: 16px;
  color: ${lightGrey};
  text-align: center;
`;
