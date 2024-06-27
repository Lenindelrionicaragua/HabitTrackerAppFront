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
  justify-content: center;
  align-items: center;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  padding: 10px;
  margin-bottom: 10px;
`;

export const SubTitle = styled(Text)`
  font-size: 10px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${grey};
`;

export const Line = styled(View)`
  height: 1px;
  width: 70%;
  background-color: ${orange};
  margin-vertical: 10px;
`;

export const ButtonContainer = styled(View)`
  flex-direction: row;
  margin-top: 0px;
  width: 80%;
  justify-content: space-between;
`;

export const StyledButton = styled(Pressable)`
  flex-direction: row;
  padding: 15px;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  height: 60px;
  width: 80%;
  background-color: orange;
`;

export const ButtonText = styled(Text)`
  color: white;
  font-size: 16px;
`;
