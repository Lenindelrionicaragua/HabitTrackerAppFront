import styled from "styled-components/native";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Colors } from "../../styles/AppStyles";
import { SafeAreaView } from "react-native";

const { white, orange, grey, yellow, lightGrey, black, lightGreen } = Colors;

const green = "#00ff00";
const red = "#ff0000";

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
  background-color: ${black};
  border-radius: 250px;
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
  color: ${orange};
  padding: 10px;
`;

export const InfoText = styled(Text)`
  color: ${grey};
  font-size: 15px;
  text-align: center;
`;

export const EmphasizeText = styled(Text)`
  font-weight: bold;
  font-style: italic;
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
    background-color: ${orange};
    flex-direction: row;
    justify-content: center;
  `}
`;

export const ButtonText = styled(Text)`
  color: ${white};
  font-size: 16px;

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
`;

export const TextLinkContent = styled(Text)`
  color: ${yellow};
  font-size: 15px;

  ${props => {
    const { resendStatus } = props;
    if (resendStatus === "Failed!") {
      return `color: ${red}`;
    } else if (resendStatus === "Sent!") {
      return `color: ${green}`;
    }
  }}
`;
