import {
  SET_MONTHLY_STATS,
  CLEAR_MONTHLY_STATS
} from "../actions/counterActions";

const initialState = {
  isDemo: true,
  totalMinutes: 0.01,
  categoryCount: 6,
  daysWithRecords: 0.01,
  dailyAverageMinutes: 0.01,
  totalDailyMinutes: {
    "2024-11-23": 0.01
  },
  categoryData: [
    {
      name: "Work",
      dailyGoal: 55,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 1705,
      colors: {
        primary: "#fb105b",
        secondary: "#ffa3b0"
      }
    },
    {
      name: "Family time",
      dailyGoal: 55,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 1705,
      colors: {
        primary: "#ff6543",
        secondary: "#ffb59f"
      }
    },
    {
      name: "Exercise",
      dailyGoal: 55,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 1705,
      colors: {
        primary: "#ad2bd5",
        secondary: "#d7b8e9"
      }
    },
    {
      name: "Screen-free",
      dailyGoal: 55,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 1705,
      colors: {
        primary: "#16A085",
        secondary: "#DAF7A6"
      }
    },
    {
      name: "Rest",
      dailyGoal: 55,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 1705,
      colors: {
        primary: "#ffe181",
        secondary: "#fff4cc"
      }
    },
    {
      name: "Study",
      dailyGoal: 55,
      totalMinutes: 0.01,
      percentage: 0.01,
      monthlyGoal: 1705,
      colors: {
        primary: "#554865",
        secondary: "#857891"
      }
    }
  ],
  dailyAverageMinutes: 0.01
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
