import styled from "styled-components/native";
import { View, Image, Text, Pressable, Platform } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, darkGrey, softGray, black, orange, green, red } = Colors;

const containerHeight = Platform.OS === "web" ? "90%" : "80%";
const containerWidth = Platform.OS === "web" ? "100%" : "100%";
const paddingLeft = Platform.OS === "web" ? "20px" : "5px";
const paddingRight = Platform.OS === "web" ? "20px" : "5px";

export const ListContainer = styled(View)`
  flex: 1;
  width: ${containerWidth};
  background-color: ${softGray};
`;

export const ListCard = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-left: ${paddingLeft};
  padding-right: ${paddingRight};
  border-bottom-width: 0.5px;
  border-color: ${darkGrey};
  background-color: ${white};
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