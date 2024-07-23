import styled from "styled-components/native";
import { View, Text, Pressable, Platform, SafeAreaView } from "react-native";

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
const ScreenTitleMarginTop = Platform.OS === "web" ? "5%" : "2%";

export const StyledContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${darkGrey};
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5%;
  padding-bottom: ${paddingBottom};
`;

export const ScreenTitle = styled(Text)`
  color: ${black};
  font-weight: bold;
  font-size: 20px;
  width: 100%;
  align-items: flex-start;
  margin-top: ${ScreenTitleMarginTop};
`;

export const TimeButtonsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  padding: 20px;
  width: 100%;
  padding: 0%;

  border-radius: 7px;
  background-color: ${white};
`;

export const TimeButton = styled(Pressable)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.6%;
  border-radius: 7px;
`;

export const ButtonTimeText = styled(Text)`
  color: ${black};
  font-size: 20px;
`;

export const Line = styled(View)`
  height: 0.5px;
  width: 100%;
  background-color: ${white};
  margin-vertical: 2px;
  padding-vertical: 0px;
`;

export const InfoText = styled(Text)`
  color: ${black};
  font-weight: light;
  font-size: 15px;
  width: 100%;
  justify-items: center;
  text-align: center;
  padding: 0px;
  margin: 0px;
`;

export const FocusTitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2px;
  margin-top: 5px;
  /*
  border-width: 0.5px;
  border-radius: 5px;
  border-color: ${white};
  */
  position: relative;
`;

export const FocusTitleText = styled(Text)`
  font-size: 20px;
  width: 70%;
  font-weight: bold;
  color: ${black};
  text-align: center;

  border-width: 0.5px;
  border-radius: 5px;
  border-color: ${white};

  padding: 0px 15px 0px 15px;
`;

export const IconContainer = styled(Pressable)`
  padding: 5px;
  margin: 5px;
  position: absolute;
  right: 0;
`;

export const ButtonText = styled(Text)`
  color: ${black};
  font-size: 10px;
`;

export const RowContainer = styled(SafeAreaView)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 8%;
  width: 100%;

  /*  
  border-width: 0.1px;
  border-radius: 5px;
  border-color: "${white}";
  */
  overflow: hidden;
  align-items: center;
`;

export const StyledButtonLeft = styled(Pressable)`
  width: 100px;
  height: 70px;
  padding: 5px;
  justify-content: center;
  align-items: center;
  /*
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 5px;
  */
  elevation: 5;
`;

export const StyledButtonRight = styled(Pressable)`
  width: 100px;
  height: 70px;
  padding: 5px;
  justify-content: center;
  align-items: center;
  /*
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 5px;
  elevation: 5;
  */
`;

export const StyledStartButton = styled(Pressable)`
  flex: 1;
  width: 100px;
  height: 70px;

  justify-content: center;
  align-items: center;
  /*
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 5px;
  elevation: 5;
  */
`;
