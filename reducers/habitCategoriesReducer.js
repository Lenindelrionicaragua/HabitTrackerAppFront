const initialHabitCategoriesState = {
  habitCategories: []
};

const SET_HABIT_CATEGORIES = "SET_HABIT_CATEGORIES";

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
    default:
      return state;
  }
};

export default habitCategoriesReducer;
