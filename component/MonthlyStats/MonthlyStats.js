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

  const categories = [
    "Work",
    "Exercise",
    "Study",
    "Yoga",
    "Rest",
    "Music",
    "Family"
  ];
  const recordedMinutes = [120, 90, 60, 300, 400, 100]; // Example data
  const goals = [150, 100, 80, 20, 100, 200]; // Example goals
  const chartColors = {
    bar: "rgba(75, 192, 192, 1)",
    line: "rgba(255, 99, 132, 1)"
  };

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
        chartColors={chartColors}
      />
      {/* <CategoryStatsContainer> */}

      {/* <SecondaryStatsContainer>
          <MinutesList>
            <MinutesTitle>Minutes</MinutesTitle>
            {categoryData.map((category, index) => (
              <CategoryItem key={category.name}>
                <ColorBox style={{ backgroundColor: sliceColors[index] }} />
                <CategoryText>{category.totalMinutes} minutes</CategoryText>
              </CategoryItem>
            ))}
          </MinutesList>
        </SecondaryStatsContainer>
        <SecondaryStatsContainer>
          <GoalsList>
            <GoalsTitle>Goals</GoalsTitle>
            {categoryData.map((category, index) => (
              <CategoryItem key={category.name}>
                <ColorBox style={{ backgroundColor: sliceColors[index] }} />
                <CategoryText>{category.dailyGoal} minutes</CategoryText>
              </CategoryItem>
            ))}
          </GoalsList>
        </SecondaryStatsContainer> */}
      {/* </CategoryStatsContainer> */}
    </StatsOverviewContainer>
  );
};

export default MonthlyStats;
