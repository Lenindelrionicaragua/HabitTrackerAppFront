import {
  SET_MONTHLY_STATS,
  CLEAR_MONTHLY_STATS
} from "../actions/counterActions";

const initialState = {
  isDemo: true,
  totalMinutes: 0.01,
  categoryCount: 6,
  daysWithRecords: 0,
  dailyAverageMinutes: 0.01,
  totalDailyMinutes: {
    "2024-11-23": 0.01
  },
  categoryData: [
    {
      name: "Work",
      dailyGoal: 0.01,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 31
    },
    {
      name: "Family time",
      dailyGoal: 0.01,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 31
    },
    {
      name: "Exercise",
      dailyGoal: 0.01,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 0.31
    },
    {
      name: "Screen-free",
      dailyGoal: 0.01,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 0.31
    },
    {
      name: "Rest",
      dailyGoal: 0.01,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 0.31
    },
    {
      name: "Study",
      dailyGoal: 0.01,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 0.31
    }
  ],
  totalCategoryMinutes: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
  categoryColors: [
    "#fb105b",
    "#ff6543",
    "#ad2bd5",
    "#16A085",
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
