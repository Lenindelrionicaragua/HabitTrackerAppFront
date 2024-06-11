import styled from "styled-components/native";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { grey, yellow } = Colors;

const green = "#00ff00";
const red = "#ff0000";

export const InfoText = styled(Text)`
  color: ${grey};
  font-size: 15px;
  text-align: center;
`;

export const EmphasizeText = styled.Text`
  font-weight: bold;
  font-style: italic;
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
