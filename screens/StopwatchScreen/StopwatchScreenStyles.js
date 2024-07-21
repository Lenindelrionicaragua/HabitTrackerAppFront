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

const paddingBottom = Platform.OS === "web" ? "7%" : "0%";
const marginTop = Platform.OS === "web" ? "1%" : "2%";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${darkGrey};
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2%;
  padding-bottom: ${paddingBottom};
`;

export const FocusTitle = styled(Text)`
  flex-direction: columns;
  align-items: center;
  justify-content: center;

  font-size: 30px;
  text-align: center;
  font-weight: bold;
  background-color: ${black};
  color: ${white};
  align-items: center;
  justify-items: center;
  border-width: 2px;
  border-radius: 5px;
  border-color: ${black};
  padding: 2%;
  width: 100%;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  flex-direction: column;
`;

export const Line = styled(View)`
  height: 2px;
  width: 100%;
  background-color: ${black};
  margin-vertical: 5px;
  padding-vertical: 0px;
`;

export const TimeButtonsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${black};
  width: 100%;
  padding: 0%;
`;

export const TimeButton = styled(Pressable)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  color: ${white};
  margin: 0.2%;
  border-width: 0.5px;
  border-radius: 5px;

  box-shadow: 2px 8px 8px rgba(0, 0, 0, 0.3);
`;

export const ButtonTimeText = styled(Text)`
  color: ${white};
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
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 5px;
  elevation: 5;
`;

export const StyledButtonRight = styled(Pressable)`
  width: 100px;
  height: 100px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 5px;
  elevation: 5;
`;

export const RowContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${marginTop};
  padding: 5px;
  width: 100%;
  background-color: ${lightPink};
  border-width: 2px;
  border-radius: 5px;
  border-color: ${black};
  overflow: hidden;
`;

export const StyledStartButton = styled(Pressable)`
  flex: 1;
  width: 100px;
  height: 100px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  transform: scale(1.01);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 5px;
  elevation: 5;
`;
