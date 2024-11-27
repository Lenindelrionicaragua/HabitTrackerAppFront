import { View, Text, Platform } from "react-native";
import styled from "styled-components/native";

const ChartContainer = styled(View)`
  background-color: ${white};
  border-radius: 10px;
  padding: 15px;
  shadow-color: ${black};
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 5;
`;

const ChartTitle = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${black};
  text-align: center;
  margin-bottom: 10px;
`;
