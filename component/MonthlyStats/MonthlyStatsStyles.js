import styled from "styled-components/native";
import { View, Text, Platform } from "react-native";
import { Colors } from "../../styles/AppStyles";
import { Dimensions } from "react-native";

const { white, black, yellow, red, lightGreen, infoWhite, inf } = Colors;
const screenWidth = Dimensions.get("window").width;
const containerWidth = screenWidth * 0.9;

export const SubTitle = styled(Text)`
  font-size: 15px;
  padding: 0px 30px;
  margin: 10px 0px 0px 0px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${black};
`;

export const InfoText = styled(Text)`
  font-size: 12px;
  padding: 0px 30px;
  margin: 10px 0px 0px 0px;

  color: ${lightGreen};
`;

export const MonthlyStatsContainer = styled(View)`
  width: ${containerWidth};
  flex-direction: center;
  border-radius: 10px;
  background-color: ${white};
  margin-vertical: 10px;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
`;
