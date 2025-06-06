import styled from "styled-components/native";
import { View, Text, Dimensions } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, black, lightGreen } = Colors;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const containerWidth = screenWidth * 0.9;
const containerHeight = screenHeight * 0.7;

export const StatsOverviewContainer = styled(View)`
  height: ${containerHeight};
  justify-content: space-evenly;
  align-items: center;
`;

export const MonthlyStatsContainer = styled(View)`
  width: ${containerWidth};
  background-color: ${white};
  flex-direction: center;
  border-radius: 10px;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
`;

export const MainStatsContainer = styled(View)`
  flex-direction: row;
  margin-vertical: 5px;
  padding: 0px 0px 5px 0px;
  align-items: center;
  justify-content: space-around;
`;

export const CategoryContainer = styled(View)`
  flex-direction: column;
  justify-content: center;
  padding: 5px;
`;

export const CategoryItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin: 2px 0px;
  justify-content: left;
`;

export const ColorBox = styled(View)`
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

export const CategoryText = styled(Text)`
  font-size: 12px;
  color: ${lightGreen};
  margin-left: 10px;
`;

export const SubTitle = styled(Text)`
  font-size: 15px;
  width: 100%;
  padding: 5px 10px 0px 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${black};
`;

export const InfoText = styled(Text)`
  font-size: 12px;
  padding: 2px 10px 0px 30px;
  color: ${lightGreen};
`;

export const SecondaryStatsContainer = styled(View)`
  width: ${containerWidth};
  height: ${containerHeight / 2.1};
  background-color: ${white};
  justify-content: space-between;
  justify-content: left;
`;
