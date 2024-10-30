const initialHabitCategoriesState = {
  habitCategories: [], 
};

const SET_HABIT_CATEGORIES = "SET_HABIT_CATEGORIES";

const habitCategoriesReducer = (
  state = initialHabitCategoriesState,
  action
) => {
  switch (action.type) {
    case SET_HABIT_CATEGORIES:
      return { ...state, habitCategories: action.payload };
    default:
      return state;
  }
};

export default habitCategoriesReducer;
