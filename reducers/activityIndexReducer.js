const initialActivityIndex = {
  activityIndex: null
};

const SET_ACTIVITY_INDEX = "SET_ACTIVITY_INDEX";

const activityIndexReducer = (state = initialActivityIndex, action) => {
  switch (action.type) {
    case SET_ACTIVITY_INDEX:
      return {
        ...state,
        activityIndex: action.payload
      };
    default:
      return state;
  }
};

export default activityIndexReducer;
