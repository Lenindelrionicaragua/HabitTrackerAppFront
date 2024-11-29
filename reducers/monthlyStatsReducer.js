import {
  SET_MONTHLY_STATS,
  CLEAR_MONTHLY_STATS
} from "../actions/counterActions";

// Define fallback values for series and sliceColors
const fallbackSeries = [54, 2, 0, 7, 5, 13]; // Ensures there's always at least one data point
const fallbackSliceColors = [
  "#fb105b",
  "#ff6543",
  "#ad2bd5",
  "#ff9c97",
  "#ffe181",
  "#554865"
]; // Default color for the fallback

const initialState = {
  isDemo: true,
  totalMinutes: 81,
  categoryCount: 6,
  daysWithRecords: 5,
  dailyAverageMinutes: 16.2,
  totalDailyMinutes: {
    "2024-11-23": 51,
    "2024-11-24": 6,
    "2024-11-26": 6,
    "2024-11-27": 5,
    "2024-11-28": 13
  },
  categoryData: [
    {
      name: "Example 1",
      dailyGoal: 0,
      totalMinutes: 54,
      percentage: 66
    },
    {
      name: "Example 2",
      dailyGoal: 0,
      totalMinutes: 2,
      percentage: 3
    },
    {
      name: "Example 3",
      dailyGoal: 0,
      totalMinutes: 0,
      percentage: 0
    },
    {
      name: "Example 4",
      dailyGoal: 0,
      totalMinutes: 7,
      percentage: 9
    },
    {
      name: "Example 5",
      dailyGoal: 0,
      totalMinutes: 5,
      percentage: 6
    },
    {
      name: "Example 6",
      dailyGoal: 0,
      totalMinutes: 13,
      percentage: 16
    }
  ],
  series: fallbackSeries,
  sliceColors: fallbackSliceColors
};

const monthlyStatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MONTHLY_STATS:
      return { ...state, ...action.payload, isDemo: false };
    case CLEAR_MONTHLY_STATS:
      return { ...initialState, isDemo: true };
    default:
      return state;
  }
};

export default monthlyStatsReducer;
