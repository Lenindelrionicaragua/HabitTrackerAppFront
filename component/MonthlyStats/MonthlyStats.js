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
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import DoughnutGrid from "../DoughnutGrid/DoughnutGrid";

const MonthlyStats = () => {
  const {
    totalMinutes,
    daysWithRecords,
    dailyAverageMinutes,
    categoryData,
    isDemo
  } = useSelector(state => state.monthlyStats);

  const dataForDoughnutGrid = categoryData.map(category => {
    const primaryColor = category.colors.primary;
    const secondaryColor = category.colors.secondary;

    const progress = category.totalMinutes;
    const remaining = Math.max(category.monthlyGoal - progress, 0);

    return {
      series: [progress, remaining],
      sliceColor: [primaryColor, secondaryColor],
      name: category.name,
      progress: category.totalMinutes
    };
  });

  return (
    <StatsOverviewContainer>
      <MonthlyStatsContainer>
        <SubTitle>
          {isDemo ? "Demo Mode: Time Distribution" : "Your Time Distribution"}
        </SubTitle>
        <InfoText>
          Days with records: {daysWithRecords} | Daily Average:{" "}
          {dailyAverageMinutes} minutes
        </InfoText>
        <MainStatsContainer>
          <DoughnutChart
            series={categoryData.map(category => category.totalMinutes)}
            sliceColor={categoryData.map(category => category.colors.primary)}
            text={totalMinutes}
          />
          <CategoryContainer>
            {categoryData.map(category => (
              <CategoryItem key={category.name}>
                <ColorBox
                  style={{ backgroundColor: category.colors.primary }}
                />
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
