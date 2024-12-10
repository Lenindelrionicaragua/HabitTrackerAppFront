import styled from "styled-components/native";
import { View, Image, Text, Pressable, Platform } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, darkGrey, softGray, black, orange, green, red } = Colors;

const containerHeight = Platform.OS === "web" ? "90%" : "80%";
const containerWidth = Platform.OS === "web" ? "100%" : "100%";
const paddingTop = Platform.OS === "web" ? "0%" : "5%";
const paddingBottom = Platform.OS === "web" ? "5%" : "0%";

export const ListContainer = styled(View)`
  flex: 1;

  width: ${containerWidth};
  background-color: ${softGray};
`;

// top: 130px;

export const ListCard = styled(View)`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${darkGrey};
`;

export const CardTitle = styled(Text)`
  padding: 20px;
  font-size: 14px;
  font-weight: bold;
  color: ${black};
`;

export const CardGoal = styled(Text)`
  padding: 20px;
  font-size: 14px;
  color: ${darkGrey};
  margin-left: auto;
`;
