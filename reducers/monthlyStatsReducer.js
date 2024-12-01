import {
  SET_MONTHLY_STATS,
  CLEAR_MONTHLY_STATS
} from "../actions/counterActions";

const initialState = {
  isDemo: true,
  totalMinutes: 1,
  categoryCount: 1,
  daysWithRecords: 1,
  totalDailyMinutes: 1,
  totalDailyMinutes: {
    "2024-11-23": 1
  },
  categoryData: [
    {
      name: "Work",
      dailyGoal: 1,
      totalMinutes: 1,
      percentage: 1,
      monthlyGoal: 31
    },
    {
      name: "Family time",
      dailyGoal: 1,
      totalMinutes: 1,
      percentage: 1,
      monthlyGoal: 31
    },
    {
      name: "Exercise",
      dailyGoal: 1,
      totalMinutes: 1,
      percentage: 1,
      monthlyGoal: 31
    },
    {
      name: "Screen-free",
      dailyGoal: 1,
      totalMinutes: 1,
      percentage: 1,
      monthlyGoal: 31
    },
    {
      name: "Rest",
      dailyGoal: 1,
      totalMinutes: 1,
      percentage: 1,
      monthlyGoal: 31
    },
    {
      name: "Study",
      dailyGoal: 1,
      totalMinutes: 1,
      percentage: 1,
      monthlyGoal: 31
    }
  ],
  totalCategoryMinutes: [1, 1, 1, 1, 1, 1],
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
