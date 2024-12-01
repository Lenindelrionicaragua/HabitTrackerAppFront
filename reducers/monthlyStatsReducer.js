import {
  SET_MONTHLY_STATS,
  CLEAR_MONTHLY_STATS
} from "../actions/counterActions";

const initialState = {
  isDemo: true,
  totalMinutes: 1118,
  categoryCount: 6,
  daysWithRecords: 5,
  dailyAverageMinutes: 223.6,
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
      dailyGoal: 15,
      totalMinutes: 254,
      percentage: 22,
      monthlyGoal: 450
    },
    {
      name: "Example 2",
      dailyGoal: 15,
      totalMinutes: 222,
      percentage: 19,
      monthlyGoal: 450
    },
    {
      name: "Example 3",
      dailyGoal: 15,
      totalMinutes: 200,
      percentage: 17,
      monthlyGoal: 450
    },
    {
      name: "Example 4",
      dailyGoal: 15,
      totalMinutes: 157,
      percentage: 14,
      monthlyGoal: 450
    },
    {
      name: "Example 5",
      dailyGoal: 15,
      totalMinutes: 155,
      percentage: 14,
      monthlyGoal: 450
    },
    {
      name: "Example 6",
      dailyGoal: 15,
      totalMinutes: 130,
      percentage: 12,
      monthlyGoal: 450
    }
  ],
  totalCategoryMinutes: [254, 222, 200, 157, 155, 130],
  categoryColors: [
    "#fb105b",
    "#ff6543",
    "#ad2bd5",
    "#ff9c97",
    "#ffe181",
    "#554865"
  ]
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
