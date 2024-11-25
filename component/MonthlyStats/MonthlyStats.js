import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MonthlyStatsContainer,
  SubTitle,
  InfoText
} from "../../component/MonthlyStats/MonthlyStatsStyles";
import useMonthlyStats from "../../hooks/api/useMonthlyStats";
import { MonthlyStatsColors } from "../../styles/AppStyles";
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import { setMonthlyStats } from "../../actions/counterActions";

// const { white, black } = Colors;
const { color1, color2, color3, color4, color5, color6, color7 } =
  MonthlyStatsColors;

// Get monthly stats from the custom hook
const MonthlyStats = () => {
  dispatch = useDispatch();
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

  useEffect(() => {
    if (!success) {
      dispatch(fetchMonthlyStats());
    }
  }, [dispatch, success]);

  return (
    <MonthlyStatsContainer>
      <SubTitle>Time distribution</SubTitle>
      <InfoText>
        Days with records: {daysWithRecords} | Daily Average:{" "}
        {dailyAverageMinutes} minutes
      </InfoText>

      <DoughnutChart
        series={series}
        sliceColor={sliceColors}
        text={totalMinutes}
      />
    </MonthlyStatsContainer>
  );
};

export default MonthlyStats;
