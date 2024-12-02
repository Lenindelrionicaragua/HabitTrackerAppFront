import React from "react";
import { useSelector } from "react-redux";
import {
  StatsOverviewContainer,
  MonthlyStatsContainer,
  MainStatsContainer,
  SecondaryStatsContainer,
  CategoryContainer,
  CategoryItem,
  CategoryText,
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

// Colors
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
    daysWithRecords,
    dailyAverageMinutes,
    categoryData,
    totalCategoryMinutes,
    categoryColors,
    isDemo
  } = useSelector(state => state.monthlyStats);

  const primaryColors = categoryColors;
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
            series={totalCategoryMinutes}
            sliceColor={categoryColors}
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
