const initialHabitCategoryIndex = {
  habitCategoryIndex: null
};

const SET_HABIT_CATEGORY_INDEX = "SET_HABIT_CATEGORY_INDEX";

const habitCategoryIndexReducer = (
  state = initialHabitCategoryIndex,
  action
) => {
  switch (action.type) {
    case SET_HABIT_CATEGORY_INDEX:
      return {
        ...state,
        habitCategoryIndex: action.payload
      };
    default:
      return state;
  }
};

export default habitCategoryIndexReducer;
