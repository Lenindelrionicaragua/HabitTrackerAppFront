import styled from "styled-components/native";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Platform
} from "react-native";
import { Colors } from "../../styles/AppStyles";
import { SafeAreaView } from "react-native";

const {
  seaGreen,
  white,
  infoWhite,
  lightPink,
  lightGrey,
  black,
  skyBlue,
  lightGreen,
  darkGrey
} = Colors;

const green = "#00ff00";
const red = "#ff0000";

const containerHeight = Platform.OS === "web" ? "90%" : "85%";
const containerWidth = Platform.OS === "web" ? "500px" : "100%";
const marginTopTopContainer = Platform.OS === "web" ? "80px" : "120px";

export const StyledContainer = styled(SafeAreaView)`
  background-color: ${lightGrey};
  width: ${containerWidth};
  height: ${containerHeight};
  align-items: ${Platform.OS === "web" ? "center" : "stretch"};
  width: 100%;
`;

export const TopContainer = styled(View)`
  flex: 1;
  justify-content: center;
  padding: 0px;
  margin-top: ${marginTopTopContainer};
  margin-bottom: -20px;
`;

export const IconBackGround = styled(View)`
  width: 250px;
  height: 250px;

  background-color: ${black};
  border-radius: 500px;
  justify-content: center;
  align-items: center;
`;

export const BottomContainer = styled(View)`
  flex: 1;
  justify-content: space-around;
  padding: 20px;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${lightGrey};
  padding: 0px;
`;

export const InfoText = styled(Text)`
  color: ${lightGrey};
  font-size: 15px;
  text-align: center;
`;

export const EmphasizeText = styled(Text)`
  font-weight: bold;
  font-style: italic;
  padding-left: 2px;
`;

export const StyledButton = styled(Pressable)`
  padding: 15px;
  background-color: ${black};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;

  ${props =>
    props.google == true &&
    `
    background-color: ${white};
    flex-direction: row;
    justify-content: center;
  `}
`;

export const ButtonText = styled(Text)`
  color: ${seaGreen};
  font-size: 16px;
  padding-right: 5px;

  ${props =>
    props.google == true &&
    `
    padding: 25px;
    color: ${black}
  `}
`;

export const InlineGroup = styled(View)`
  flex-direction: row;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

export const TextLink = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  color: ${green};
  padding-left: 5px;
`;

export const TextLinkContent = styled(Text)`
  font-size: 15px;

  ${props => {
    const { resendStatus } = props;
    if (resendStatus === "Failed!") {
      return `color: ${red}`;
    } else if (resendStatus === "Sent!") {
      return `color: ${lightGreen}`;
    }
  }}
`;
