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
import { Colors, MonthlyStatsColors } from "../../styles/AppStyles";
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import MixedChart from "../MixedChart/MixedChart";

import { setMonthlyStats } from "../../actions/counterActions";

const { white, black } = Colors;
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

  // Secondary fallback to handle cases where the user has no activity records.
  // While the reducer provides fallback values for fetch failures, this ensures
  // the DoughnutChart renders properly with placeholder values when the data
  // fetch is successful but returns no meaningful records (e.g., a new user).
  const seriesSum = series.reduce((sum, value) => sum + value, 0);
  const finalSeries = seriesSum === 0 ? [1] : series;
  const finalSliceColors =
    seriesSum === 0 ? ["#bbcbde"] : sliceColors.slice(0, finalSeries.length);

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
            series={finalSeries}
            sliceColor={finalSliceColors}
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
      <MainStatsContainer>
        {categoryData.length > 0 ? (
          <MixedChart
            categories={categories}
            recordedMinutes={recordedMinutes}
            goals={goals}
            chartColors={{
              bar: categories.map(name => colorMap[name]),
              line: "rgba(255, 99, 132, 1)"
            }}
          />
        ) : (
          <InfoText>No data available for MixedChart</InfoText>
        )}
      </MainStatsContainer>
    </StatsOverviewContainer>
  );
};

export default MonthlyStats;
