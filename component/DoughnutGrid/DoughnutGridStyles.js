import { View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Colors } from "../../styles/AppStyles";

const { white, black, green } = Colors;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const containerWidth = screenWidth * 0.9;
const containerHeight = screenHeight * 0.3;

export const GridContainer = styled.View`
  width: ${containerWidth};
  height: ${containerHeight};
  border-radius: 10px;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const GridItem = styled.View`
  margin-bottom: 5px;
  align-items: center;
`;
