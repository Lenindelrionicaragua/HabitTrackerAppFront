const initialHabitCategoriesState = {
  // Default categories without ids for the first view
  habitCategories: [
    { name: "Work" },
    { name: "Family time" },
    { name: "Exercise" },
    { name: "Screen-free" },
    { name: "Rest" },
    { name: "Study" }
  ]
};

const SET_HABIT_CATEGORIES = "SET_HABIT_CATEGORIES";
const RESET_HABIT_CATEGORIES = "RESET_HABIT_CATEGORIES";

const habitCategoriesReducer = (
  state = initialHabitCategoriesState,
  action
) => {
  switch (action.type) {
    case SET_HABIT_CATEGORIES:
      const categoriesWithIdName = action.payload.map(category => ({
        id: category.id,
        name: category.name
      }));
      return { ...state, habitCategories: categoriesWithIdName };

    case RESET_HABIT_CATEGORIES:
      return initialHabitCategoriesState; // Reset to the initial state

    default:
      return state;
  }
};

export default habitCategoriesReducer;
