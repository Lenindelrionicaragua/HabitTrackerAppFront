import React from "react";
import { useSelector } from "react-redux";
import {
  StatsOverviewContainer,
  MonthlyStatsContainer,
  CategoryStatsContainer,
  MainStatsContainer,
  SecondaryStatsContainer,
  CategoryContainer,
  CategoryItem,
  CategoryText,
  MinutesList,
  GoalsTitle,
  MinutesTitle,
  GoalsList,
  ColorBox,
  SubTitle,
  InfoText
} from "../../component/MonthlyStats/MonthlyStatsStyles";
import { MonthlyStatsColors } from "../../styles/AppStyles";
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import MixedChart from "../MixedChart/MixedChart";

import { setMonthlyStats } from "../../actions/counterActions";

// const { white, black } = Colors;
const { color1, color2, color3, color4, color5, color6, color7 } =
  MonthlyStatsColors;

// Get monthly stats from the custom hook
const MonthlyStats = () => {
  // dispatch = useDispatch();
  const {
    totalMinutes,
    categoryCount,
    daysWithRecords,
    dailyAverageMinutes,
    categoryData,
    series,
    sliceColors,
    success
  } = useSelector(state => state.monthlyStats);

  const colorMap = categoryData.reduce((map, category, index) => {
    map[category.name] = sliceColors[index];
    return map;
  }, {});

  const categories = categoryData.map(category => category.name);
  const recordedMinutes = categoryData.map(category => category.totalMinutes);
  const goals = categoryData.map(category => category.goal || 0);

  return (
    <StatsOverviewContainer>
      <MonthlyStatsContainer>
        <SubTitle>Time distribution</SubTitle>
        <InfoText>
          Days with records: {daysWithRecords} | Daily Average:{" "}
          {dailyAverageMinutes} minutes
        </InfoText>
        <MainStatsContainer>
          <DoughnutChart
            series={series}
            sliceColor={sliceColors}
            text={totalMinutes}
          />
          <CategoryContainer>
            {categoryData.map((category, index) => (
              <CategoryItem key={category.name}>
                <ColorBox style={{ backgroundColor: sliceColors[index] }} />
                <CategoryText>
                  {category.name} ({category.percentage}%)
                </CategoryText>
              </CategoryItem>
            ))}
          </CategoryContainer>
        </MainStatsContainer>
      </MonthlyStatsContainer>
      <MixedChart
        categories={categories}
        recordedMinutes={recordedMinutes}
        goals={goals}
        chartColors={{
          bar: categories.map(name => colorMap[name]),
          line: "rgba(255, 99, 132, 1)"
        }}
      />
    </StatsOverviewContainer>
  );
};

export default MonthlyStats;
