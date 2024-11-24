import styled from "styled-components/native";
import { View, Text } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, black } = Colors;

export const PieChartContainer = styled(View)`
  position: relative;
  justify-content: center;
  align-items: center;
  padding: 15px;
`;

export const InfoTextContainer = styled(View)`
  flex-direction: column;
  position: absolute;
  justify-content: center;
  align-items: center;
`;

export const InfoText = styled(Text)`
  font-size: 18;
  font-weight: bold;
  color: ${black};
`;

export const SubText = styled(Text)`
  font-size: 12px;
  color: ${black};
  margin-top: 5px;
`;
