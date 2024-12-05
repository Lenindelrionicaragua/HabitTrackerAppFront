const initialMetricsState = {
  needsMetricsUpdate: false
};

const metricsUpdateReducer = (state = initialMetricsState, action) => {
  switch (action.type) {
    case "TRIGGER_METRICS_UPDATE":
      return {
        ...state,
        needsMetricsUpdate: !state.needsMetricsUpdate
      };
    default:
      return state;
  }
};

export default metricsUpdateReducer;
