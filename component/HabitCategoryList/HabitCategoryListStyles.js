import styled from "styled-components/native";
import { View, Text } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, darkGrey, softGray, black } = Colors;

export const ListContainer = styled(View)`
  flex: 1;
  padding: 10px;
  background-color: ${softGray};
`;

export const ListCard = styled(View)`
  background-color: ${white};
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  shadow-color: ${darkGrey};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  width: 100%;
`;

export const CardTitle = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${black};
`;

export const CardGoal = styled(Text)`
  font-size: 14px;
  color: ${darkGrey};
  margin-top: 5px;
`;
