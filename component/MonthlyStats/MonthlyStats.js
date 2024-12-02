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
import {
  Colors,
  MonthlyStatsColors,
  DoughnutChartSmallColors
} from "../../styles/AppStyles";

import DoughnutChart from "../DoughnutChart/DoughnutChart";
import DoughnutGrid from "../DoughnutGrid/DoughnutGrid";
// import MixedChart from "../MixedChart/MixedChart";

import { setMonthlyStats } from "../../actions/counterActions";

const { white, black } = Colors;
const { color1, color2, color3, color4, color5, color6 } = MonthlyStatsColors;

const {
  secondary1,
  secondary2,
  secondary3,
  secondary4,
  secondary5,
  secondary6
} = DoughnutChartSmallColors;

// Get monthly stats from the custom hook
const MonthlyStats = () => {
  // dispatch = useDispatch();
  const {
    totalMinutes,
    categoryCount,
    daysWithRecords,
    dailyAverageMinutes,
    categoryData,
    totalCategoryMinutes,
    categoryColors,
    success,
    isDemo
  } = useSelector(state => state.monthlyStats);

  const categoryMinutesSum = totalCategoryMinutes.reduce(
    (sum, value) => sum + value,
    0
  );
  const finalCategoryMinutes =
    categoryMinutesSum === 0 ? [1] : totalCategoryMinutes;
  const finalCategoryColors =
    categoryMinutesSum === 0
      ? ["#bbcbde"]
      : categoryColors.slice(0, finalCategoryMinutes.length);

  const colorMap = categoryData.reduce((map, category, index) => {
    map[category.name] = categoryColors[index];
    return map;
  }, {});

  // const categories = categoryData.map(category => category.name);
  // const recordedMinutes = categoryData.map(category => category.totalMinutes);

  const monthlyGoals = categoryData.map(category =>
    category.monthlyGoal === 0 ? 600 : category.monthlyGoal
  );

  const primaryColors = Object.values(MonthlyStatsColors);
  const secondaryColors = Object.values(DoughnutChartSmallColors);

  const dataForDoughnutGrid = categoryData.map((category, index) => {
    const primaryColor = primaryColors[index % primaryColors.length];
    const secondaryColor = secondaryColors[index % secondaryColors.length];

    const progress = category.totalMinutes;
    const remaining = Math.max(category.monthlyGoal - progress, 0);

    return {
      series: [progress, remaining],
      sliceColor: [primaryColor, secondaryColor],
      text: category.name
    };
  });

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
      <SecondaryStatsContainer>
        <DoughnutGrid data={dataForDoughnutGrid} />
      </SecondaryStatsContainer>
    </StatsOverviewContainer>
  );
};

export default MonthlyStats;
