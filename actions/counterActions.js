import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSelector } from "reselect";

export const SET_INITIAL_TIME = "SET_INITIAL_TIME";
export const SET_REMAINING_TIME = "SET_REMAINING_TIME";
export const SET_ELAPSED_TIME = "SET_ELAPSED_TIME";
export const SET_TIME_COMPLETED = "SET_TIME_COMPLETED";
export const SET_IS_RUNNING = "SET_IS_RUNNING";
export const SET_FIRST_RUN = "SET_FIRST_RUN";
export const SET_START_TIME_REF = "SET_START_TIME_REF";

export const SET_RESET_BUTTON_LABEL = "SET_RESET_BUTTON_LABEL";
export const SET_INFO_TEXT = "SET_INFO_TEXT";
export const SET_RESET_CLICKS = "SET_RESET_CLICKS";
export const SET_RESET_TIMEOUTS_IDS = "SET_RESET_TIMEOUTS_IDS";
export const SET_HAS_STARTED = "SET_HAS_STARTED";
export const SET_CIRCLE_COLOR = "SET_CIRCLE_COLOR";
export const SET_INNER_CIRCLE_COLOR = "SET_INNER_CIRCLE_COLOR";
export const SET_BUTTONS_DISABLED = "SET_BUTTONS_DISABLED";
export const SET_SAVE_TIME_BUTTON_LABEL = "SET_SAVE_TIME_BUTTON_LABEL";

export const SET_HABIT_CATEGORIES = "SET_HABIT_CATEGORIES";
export const SET_HABIT_CATEGORY_INDEX = "SET_HABIT_CATEGORY_INDEX";
export const RESET_HABIT_CATEGORIES = "RESET_HABIT_CATEGORIES";

export const SET_MONTHLY_STATS = "SET_MONTHLY_STATS";
export const CLEAR_MONTHLY_STATS = "CLEAR_MONTHLY_STATS";

export const SET_PAUSE_TIME = "SET_PAUSE_TIME";

export const SET_ACTIVE_SCREEN = "SET_ACTIVE_SCREEN";

export const setInitialTime = newInitialTime => {
  return {
    type: SET_INITIAL_TIME,
    payload: newInitialTime
  };
};

export const setRemainingTime = newRemainingTime => {
  return {
    type: SET_REMAINING_TIME,
    payload: newRemainingTime
  };
};

export const setElapsedTime = newElapsedTime => {
  return {
    type: SET_ELAPSED_TIME,
    payload: newElapsedTime
  };
};

export const setTimeCompleted = newTimeCompleted => {
  return {
    type: SET_TIME_COMPLETED,
    payload: newTimeCompleted
  };
};

export const setIsRunning = newIsRunning => {
  return {
    type: SET_IS_RUNNING,
    payload: newIsRunning
  };
};

export const setFirstRun = newFirstRun => {
  return {
    type: SET_FIRST_RUN,
    payload: newFirstRun
  };
};

export const setResetButtonLabel = newResetButtonLabel => {
  return {
    type: SET_RESET_BUTTON_LABEL,
    payload: newResetButtonLabel
  };
};

export const setInfoText = newInfoText => {
  return {
    type: SET_INFO_TEXT,
    payload: newInfoText
  };
};

export const setResetClicks = newResetClicks => {
  return {
    type: SET_RESET_CLICKS,
    payload: newResetClicks
  };
};

export const setResetTimeoutsIds = timeoutsIds => {
  return {
    type: SET_RESET_TIMEOUTS_IDS,
    payload: timeoutsIds
  };
};

export const setHasStarted = newHasStarted => {
  return {
    type: SET_HAS_STARTED,
    payload: newHasStarted
  };
};

export const setCircleColor = newCircleColor => {
  return {
    type: SET_CIRCLE_COLOR,
    payload: newCircleColor
  };
};

export const setInnerCircleColor = newInnerCircleColor => {
  return {
    type: SET_INNER_CIRCLE_COLOR,
    payload: newInnerCircleColor
  };
};

export const setPauseTime = pauseTime => {
  return {
    type: SET_PAUSE_TIME,
    payload: pauseTime
  };
};

export const setSaveTimeButtonLabel = saveTimeButtonLabel => {
  return {
    type: SET_SAVE_TIME_BUTTON_LABEL,
    payload: saveTimeButtonLabel
  };
};

export const setButtonsDisabled = buttonsDisabled => {
  return {
    type: SET_BUTTONS_DISABLED,
    payload: buttonsDisabled
  };
};

export const setHabitCategoryIndex = habitCategoryIndex => {
  return {
    type: SET_HABIT_CATEGORY_INDEX,
    payload: habitCategoryIndex
  };
};

// Action to load habit categories from AsyncStorage
export const loadHabitCategories = () => {
  return async dispatch => {
    try {
      const storedCategories = await AsyncStorage.getItem("habitCategories");
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        dispatch({
          type: SET_HABIT_CATEGORIES,
          payload: parsedCategories
        });
      }
    } catch (error) {
      console.error("Error loading categories from AsyncStorage:", error);
    }
  };
};

export const setHabitCategories = habitCategories => ({
  type: SET_HABIT_CATEGORIES,
  payload: habitCategories
});

export const resetHabitCategories = () => ({
  type: RESET_HABIT_CATEGORIES
});

const selectMonthlyStats = state => state.monthlyStats;

export const selectMonthlyStatsWithFallback = createSelector(
  [selectMonthlyStats],
  stats => ({
    ...stats,
    series: stats.series.length ? stats.series : [1], // Example fallback value
    sliceColors: stats.sliceColors.length ? stats.sliceColors : ["#cccccc"] // Fallback color
  })
);

export const clearMonthlyStats = () => ({
  type: CLEAR_MONTHLY_STATS
});

export const setActiveScreen = screen => {
  return {
    type: SET_ACTIVE_SCREEN,
    payload: screen
  };
};
