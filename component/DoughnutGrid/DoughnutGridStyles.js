import { View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Colors } from "../../styles/AppStyles";

const { white, black, green } = Colors;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const containerWidth = screenWidth * 0.9;
const containerHeight = screenHeight * 0;

export const MainStatsContainer = styled(View)`
  flex: 1;
  width: ${containerWidth};
  height: ${containerHeight};
  background-color: ${white};
  flex-direction: center;
  border-radius: 10px;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
`;

export const GridContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-vertical: 5px;
  align-content: center;
  align-items: center;
  justify-content: space-around;
  background-color: ${white};
`;

export const GridItem = styled.View`
  width: 30%;
  margin-bottom: 0px;
  align-items: center;
`;

export const SubTitle = styled(Text)`
  font-size: 15px;
  padding: 0px 30px;
  margin: 10px 0px 0px 0px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${black};
`;
