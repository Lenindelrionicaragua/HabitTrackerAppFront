import styled from "styled-components/native";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, orange, grey, yellow, lightGrey, black } = Colors;

const green = "#00ff00";
const red = "#ff0000";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${lightGrey};
  width: 100%;
  justify-content: left;
  align-items: center;
  padding: 10%;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 10px;
  margin-bottom: 10px;
`;

export const FocusTitle = styled(Text)`
  font-size: 18px;
  margin-bottom: 0px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${grey};
`;

export const Line = styled(View)`
  height: 1px;
  width: 70%;
  background-color: ${orange};
  margin-vertical: 5 %;
  padding-vertical: 0px;
`;

export const SwapButton = styled(Pressable)`
  flex-direction: columns;
  padding-vertical: 0px;
  padding-horizontal: 0px;
  align-items: center;
  border-radius: 5px;
`;

export const ButtonContainer = styled(View)`
  flex-direction: row;
  margin-top: 10%;
  width: 80%;
  justify-content: space-between;
`;

export const StyledButton = styled(Pressable)``;

export const ButtonText = styled(Text)`
  color: white;
  font-size: 16px;
`;

export const RowContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  width: 60%;
  background-color: ${black};
`;
