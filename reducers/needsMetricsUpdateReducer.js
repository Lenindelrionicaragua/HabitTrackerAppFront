const initialMetricsState = {
  needsMetricsUpdate: false
};

const metricsReducer = (state = initialMetricsState, action) => {
  switch (action.type) {
    case TRIGGER_METRICS_UPDATE:
      return {
        ...state,
        needsMetricsUpdate: !state.needsMetricsUpdate
      };
    default:
      return state;
  }
};

export default metricsReducer;
