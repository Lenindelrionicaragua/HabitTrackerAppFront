const initialHabitCategoriesState = {
  // Default categories without ids and dailyGoals for the first view
  habitCategories: [
    {
      id: "674dbad93b1c8db22d452d55",
      name: "Work",
      dailyGoal: 55
    },
    {
      id: "674dbad93b1c8db22d452d58",
      name: "Family time",
      dailyGoal: 55
    },
    {
      id: "674dbad93b1c8db22d452d5b",
      name: "Exercise",
      dailyGoal: 55
    },
    {
      id: "674dbad93b1c8db22d452d5e",
      name: "Screen-free",
      dailyGoal: 55
    },
    {
      id: "674dbad93b1c8db22d452d61",
      name: "Rest",
      dailyGoal: 55
    },
    {
      id: "674dbad93b1c8db22d452d64",
      name: "Study",
      dailyGoal: 55
    }
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
        name: category.name,
        dailyGoal: category.dailyGoal
      }));
      return { ...state, habitCategories: categoriesWithIdName };

    case RESET_HABIT_CATEGORIES:
      return initialHabitCategoriesState; // Reset to the initial state

    default:
      return state;
  }
};

export default habitCategoriesReducer;
