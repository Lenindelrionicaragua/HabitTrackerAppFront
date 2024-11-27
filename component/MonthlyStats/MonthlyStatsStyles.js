import styled from "styled-components/native";
import { View, Text, Dimensions } from "react-native";
import { Colors } from "../../styles/AppStyles";

const { white, black, lightGreen, green } = Colors;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const containerWidth = screenWidth * 0.9;
const containerHeight = screenHeight * 0.7;

export const StatsOverviewContainer = styled(View)`
  height: ${containerHeight};
  background-color: ${green};
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
  justify-content: space-around;
`;

export const CategoryContainer = styled(View)`
  flex-direction: column;
  margin-vertical: 10px;
  justify-content: center;
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

// export const CategoryStatsContainer = styled(View)`
//   width: ${containerWidth};
//   justify-content: space-between;
//   flex-direction: row;
// `;

// export const SecondaryStatsContainer = styled(View)`
//   justify-content: space-between;
//   justify-content: left;
// `;

// export const MinutesList = styled(View)`
//   width: ${containerWidth / 2.03};
//   height: ${containerHeight / 3};
//   background-color: ${white};
//   flex-direction: center;
//   padding: 0px 30px;
//   border-radius: 10px;
//   shadow-color: ${black};
//   shadow-opacity: 0.5;
//   shadow-radius: 4px;
//   elevation: 6;
// `;

// export const GoalsList = styled(View)`
//   width: ${containerWidth / 2.03};
//   height: ${containerHeight / 3};
//   background-color: ${white};
//   flex-direction: center;
//   padding: 0px 30px;
//   border-radius: 10px;
//   shadow-color: ${black};
//   shadow-opacity: 0.5;
//   shadow-radius: 4px;
//   elevation: 6;
// `;

// export const MinutesTitle = styled(Text)`
//   font-size: 15px;
//   padding: 10px 0px 10px 0px;
//   margin: 0px 0px 0px 0px;
//   letter-spacing: 1px;
//   font-weight: bold;
//   color: ${black};
// `;

// export const GoalsTitle = styled(Text)`
//   font-size: 15px;
//   padding: 10px 0px 10px 0px;
//   margin: 0px 0px 0px 0px;
//   letter-spacing: 1px;
//   font-weight: bold;
//   color: ${black};
// `;
