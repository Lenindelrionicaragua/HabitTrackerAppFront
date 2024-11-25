import { logInfo } from "../util/logging";
import {
  SET_MONTHLY_STATS,
  CLEAR_MONTHLY_STATS
} from "../actions/counterActions";

// Define fallback values for series and sliceColors
const fallbackSeries = [1]; // Ensures there's always at least one data point
const fallbackSliceColors = ["#ffffff"]; // Default color for the fallback

const initialState = {
  totalMinutes: 0,
  categoryCount: 0,
  daysWithRecords: 0,
  dailyAverageMinutes: 0,
  categoryData: [],
  series: fallbackSeries,
  sliceColors: fallbackSliceColors
};

const monthlyStatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MONTHLY_STATS:
      const newState = { ...state, ...action.payload };
      return newState;
    case CLEAR_MONTHLY_STATS:
      return { ...initialState }; // Reset to initial state
    default:
      return state;
  }
};

export default monthlyStatsReducer;
