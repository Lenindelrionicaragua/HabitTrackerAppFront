import { View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Colors } from "../../styles/AppStyles";

const { white, black, green } = Colors;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const containerWidth = screenWidth * 0.9;
const containerHeight = screenHeight * 0.9;

export const ChartContainer = styled(View)`
  width: ${containerWidth};
  height: ${containerHeight / 3};
  background-color: ${white};
  border-radius: 10px;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
  background-color: ${green};
`;

export const ChartTitle = styled(Text)`
  padding: 10px 0px 0px 0px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  color: ${black};
  text-align: left;
`;
