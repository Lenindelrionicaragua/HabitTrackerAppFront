import styled from "styled-components/native";
import { View, Text, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import { Colors } from "../../styles/AppStyles";

const {
  seaGreen,
  white,
  infoWhite,
  lightPink,
  darkGrey,
  black,
  skyBlue,
  lightGreen
} = Colors;

const green = "#00ff00";
const red = "#3cbc9c";

const paddingBottom = Platform.OS === "web" ? "7%" : "0%";
const marginTop = Platform.OS === "web" ? "1%" : "2%";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${darkGrey};
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2%;
  padding-bottom: ${paddingBottom};
`;

export const FocusTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  background-color: ${white};
  color: ${black};
  align-items: center;
  justify-items: center;
  border-width: 4px;
  border-radius: 3px;
  border-color: ${red};
  padding: 2%;
  width: 100%;
`;

export const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${white};
  margin-vertical: 5px;
  padding-vertical: 0px;
`;

export const TimeButtonsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0%;
  padding-bottom: 1%;
`;

export const TimeButton = styled(Pressable)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: ${white};
  margin: 0px;
  border-width: 2px;
  border-radius: 3px;
  border-color: ${white};
  box-shadow: 2px 8px 8px rgba(0, 0, 0, 0.3);
  background-color: ${({ active }) => (active ? white : "transparent")};
`;

export const ButtonTimeText = styled(Text)`
  color: ${black};
  font-size: 20px;
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
  background-color: ${white};
`;

export const StyledStartButton = styled(Pressable)`
  width: 100px;
  height: 100px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  transform: scale(1.5);
`;
