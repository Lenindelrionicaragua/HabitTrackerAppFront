const initialActivitiesState = {
  activities: [
    "Study",
    "Work",
    "Exercise",
    "Family time",
    "Screen-free time",
    "Rest"
  ]
};

const SET_ACTIVITIES = "SET_ACTIVITIES";

const activitiesReducer = (state = initialActivitiesState, action) => {
  switch (action.type) {
    case SET_ACTIVITIES:
      return { ...state, activities: action.payload };
    default:
      return state;
  }
};

export default activitiesReducer;
