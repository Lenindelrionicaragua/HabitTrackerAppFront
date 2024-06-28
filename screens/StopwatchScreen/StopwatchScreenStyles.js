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

  padding-bottom: 0%;
  margin-bottom: 0%;
`;

export const FocusTitle = styled(Text)`
  font-size: 18px;
  margin-bottom: 0px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${grey};
`;

export const SwapButton = styled(Pressable)`
  flex-direction: columns;
  padding-vertical: 0px;
  padding-horizontal: 0px;
  align-items: center;
  border-radius: 5px;
  background-color: ${orange};
`;

export const Line = styled(View)`
  height: 1px;
  width: 70%;
  background-color: ${orange};
  margin-vertical: 5 %;
  padding-vertical: 0px;
`;

export const ButtonsContainer = styled(View)`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  padding: 0%;
  margin-bottom: 15%;
`;

export const StyledButton = styled(Pressable)`
  padding: 1% 8% 1% 8%;
  background-color: ${black};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

export const RowContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const StyledStartButton = styled(Pressable)`
  padding: 1% 8% 1% 8%;
  background-color: ${black};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;
