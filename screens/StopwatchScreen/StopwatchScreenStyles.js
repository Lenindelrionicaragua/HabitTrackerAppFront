import styled from "styled-components/native";
import { View, Text, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, orange, grey, yellow, lightGrey, black } = Colors;

const green = "#00ff00";
const red = "#ff0000";

const paddingBottom = Platform.OS === "web" ? "7%" : "0%";
const marginTop = Platform.OS === "web" ? "1%" : "2%";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${lightGrey};
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2%;
  padding-bottom: ${paddingBottom};
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${black};
  margin-top: 0px;
  padding-bottom: 0%;
  margin-bottom: 0%;
`;

export const FocusTitle = styled(Text)`
  font-size: 18px;
  text-align: center;
  align-self: center;
  margin-bottom: 0px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${grey};
`;

export const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${orange};
  margin-vertical: 5px;
  padding-vertical: 0px;
`;

export const DotTimeButton = styled(Pressable)`
  flex: 1;
  flex-direction: row;
  padding: 5px 30px 5px 30px;
  margin: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${white};
  border-radius: 5px;
`;

export const DotTimeButtonsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0%;
  background-color: ${black};
`;

export const ButtonText = styled(Text)`
  color: ${black};
  font-size: 10px;
`;

export const StyledButtonLeft = styled(Pressable)`
  width: 100px;
  height: 100px;
  padding: 10px;

  justify-content: center;
  align-items: center;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`;

export const StyledButtonRight = styled(Pressable)`
  width: 100px;
  height: 100px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
`;

export const RowContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${marginTop};
  padding: 5px;
  width: 100%;
  background-color: ${orange};
`;

export const StyledStartButton = styled(Pressable)`
  width: 100px;
  height: 100px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  transform: scale(1.5);
`;
