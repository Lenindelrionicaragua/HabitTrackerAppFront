const initialActiveScreenState = {
  activeScreen: "StopWatchScreen"
};

const activeScreenReducer = (state = initialActiveScreenState, action) => {
  switch (action.type) {
    case "SET_ACTIVE_SCREEN":
      return {
        ...state,
        activeScreen: action.payload
      };
    default:
      return state;
  }
};

export default activeScreenReducer;
