import styled from "styled-components/native";
import { View, Image, Text, TextInput, Pressable } from "react-native";
import { Colors } from "../../styles/AppStyles";
import { SafeAreaView } from "react-native";

const { white, orange, grey, yellow, lightGrey, black, lightGreen } = Colors;

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${lightGrey};
  width: 100%;
`;

export const TopContainer = styled(View)`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

export const IconBackGround = styled(View)`
  width: 250px;
  height: 250px;
  background-color: ${lightGreen};
  border-radius: 250px;
  justify-content: center;
  align-items: center;
`;

export const BottomContainer = styled(View)`
  justify-content: space-around;
`;
