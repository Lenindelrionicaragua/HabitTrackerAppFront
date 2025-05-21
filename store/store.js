import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers/rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: {
        warnAfter: 200 // Raise threshold to 200ms, to avoid excessive warnings
      }
    })
});

export default store;
