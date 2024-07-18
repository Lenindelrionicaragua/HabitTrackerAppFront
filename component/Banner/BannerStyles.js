import styled from "styled-components/native";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { black, seaGreen } = Colors;

export const BannerContainer = styled(View)`
  position: absolute;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  z-index: 10;
`;

export const ButtonContainer = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  background-color: ${black};
  padding: 10px;
`;

export const Button = styled(TouchableOpacity)`
  padding-vertical: 10px;
  padding-horizontal: 20px;
  align-items: center;
  border-radius: 5px;
`;

export const ButtonText = styled(Text)`
  color: ${seaGreen};
  font-size: 12px;
`;
