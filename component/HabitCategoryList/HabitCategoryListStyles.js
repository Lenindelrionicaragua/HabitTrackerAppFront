import styled from "styled-components/native";
import { View, Image, Text, Pressable, Platform } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, darkGrey, softGray, black, orange } = Colors;

const containerHeight = Platform.OS === "web" ? "80%" : "50%";
const containerWidth = Platform.OS === "web" ? "100%" : "100%";
const paddingTop = Platform.OS === "web" ? "0%" : "5%";
const paddingBottom = Platform.OS === "web" ? "5%" : "0%";

export const ListContainer = styled(View)`
  flex: 1;

  top: 150px;
  width: ${containerWidth};
  height: ${containerHeight};
  background-color: ${orange};
`;

export const ListCard = styled(View)`
  background-color: ${white};
  flex-direction: row;

  border-bottom-width: 1px;
  border-color: ${darkGrey};
`;

export const CardTitle = styled(Text)`
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
  color: ${black};
`;

export const CardGoal = styled(Text)`
  padding: 10px;
  font-size: 14px;
  color: ${darkGrey};
  margin-top: 5px;
`;
