import styled from "styled-components/native";
import { View, Text, Dimensions } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, black, lightGreen } = Colors;

const screenWidth = Dimensions.get("window").width;
const containerWidth = screenWidth * 0.9;

export const StatsOverviewContainer = styled(View)`
  background-color: ${white};
`;

export const MonthlyStatsContainer = styled(View)`
  width: ${containerWidth};
  flex-direction: center;
  border-radius: 10px;
  margin-vertical: 10px;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
`;

export const MainStatsContainer = styled(View)`
  flex-direction: row;
  margin-vertical: 5px;
  justify-content: space-around;
`;

export const CategoryStatsContainer = styled(View)`
  width: ${containerWidth};
  flex-direction: center;
`;

export const SecondaryStatsContainer = styled(View)`
  flex-direction: row;
  margin-vertical: 10px;
  justify-content: space-around;
`;

export const MinutesList = styled(View)`
  flex-direction: center;
  border-radius: 10px;
  margin-vertical: 10px;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
`;

export const GoalsList = styled(View)`
  flex-direction: center;
  border-radius: 10px;
  margin-vertical: 10px;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
`;

export const CategoryContainer = styled(View)`
  flex-direction: column;
  margin-vertical: 10px;
  justify-content: center;
  shadow-color: ${black};
  shadow-opacity: 0.5;
  shadow-radius: 4px;
  elevation: 6;
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
  padding: 0px 30px;
  margin: 10px 0px 0px 0px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${black};
`;

export const InfoText = styled(Text)`
  font-size: 12px;
  padding: 0px 30px;
  margin: 10px 0px 0px 0px;
  color: ${lightGreen};
`;
