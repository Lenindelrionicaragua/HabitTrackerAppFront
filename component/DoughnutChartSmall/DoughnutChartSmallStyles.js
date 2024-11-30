import { View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Colors } from "../../styles/AppStyles";

const { white, black, green } = Colors;

export const PieChartContainer = styled(View)`
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin: 5px;
`;

export const InfoTextContainer = styled(View)`
  flex-direction: column;
  position: absolute;
  justify-content: center;
  align-items: center;
`;

export const InfoText = styled(Text)`
  font-size: 10;
  font-weight: bold;
  color: ${black};
`;

export const SubText = styled(Text)`
  font-size: 8px;
  color: ${black};
  margin-top: 3%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
