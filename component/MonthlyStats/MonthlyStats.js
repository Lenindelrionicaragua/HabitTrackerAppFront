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
// import ProgressChartComponent from "../ProgressChart/ProgressChart";

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
    categoryMinutes,
    categoryColors,
    success,
    isDemo
  } = useSelector(state => state.monthlyStats);

  // Secondary fallback to handle cases where the user has no activity records.
  // While the reducer provides fallback values for fetch failures, this ensures
  // the DoughnutChart renders properly with placeholder values when the data
  // fetch is successful but returns no meaningful records (e.g., a new user).
  const categoryMinutesSum = categoryMinutes.reduce(
    (sum, value) => sum + value,
    0
  );
  const finalCategoryMinutes = categoryMinutesSum === 0 ? [1] : categoryMinutes;
  const finalCategoryColors =
    categoryMinutesSum === 0
      ? ["#bbcbde"]
      : categoryColors.slice(0, finalCategoryMinutes.length);

  const colorMap = categoryData.reduce((map, category, index) => {
    map[category.name] = categoryColors[index];
    return map;
  }, {});

  const categories = categoryData.map(category => category.name);
  const recordedMinutes = categoryData.map(category => category.totalMinutes);

  const goals = categoryData.map(category => category.goal || 0);

  return (
    <StatsOverviewContainer>
      <MonthlyStatsContainer>
        <SubTitle>
          {isDemo
            ? "Demo Mode: Example Time Distribution"
            : "Your Time Distribution"}
        </SubTitle>
        <InfoText>
          Days with records: {daysWithRecords} | Daily Average:{" "}
          {dailyAverageMinutes} minutes
        </InfoText>
        <MainStatsContainer>
          <DoughnutChart
            series={finalCategoryMinutes}
            sliceColor={finalCategoryColors}
            text={totalMinutes}
          />
          <CategoryContainer>
            {categoryData.map((category, index) => (
              <CategoryItem key={category.name}>
                <ColorBox style={{ backgroundColor: categoryColors[index] }} />
                <CategoryText>
                  {category.name} ({category.percentage}%)
                </CategoryText>
              </CategoryItem>
            ))}
          </CategoryContainer>
        </MainStatsContainer>
      </MonthlyStatsContainer>
      <MainStatsContainer>
        <MainStatsContainer>
          {/* <ProgressChartComponent
            chartColors={{
              bar: categories.map(name => colorMap[name]),
              line: "rgba(255, 99, 132, 1)"
            }}
          /> */}
        </MainStatsContainer>

        <MixedChart
          categories={categories}
          recordedMinutes={recordedMinutes}
          goals={goals}
          chartColors={{
            bar: categories.map(name => colorMap[name]),
            line: "rgba(255, 99, 132, 1)"
          }}
        />
      </MainStatsContainer>
    </StatsOverviewContainer>
  );
};

export default MonthlyStats;
