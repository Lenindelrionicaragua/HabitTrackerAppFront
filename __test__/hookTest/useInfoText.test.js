import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { combineReducers } from "redux";
import { infoTextReducer } from "../../reducers/infoTextReducer";
import useInfoText from "../../hooks/useInfoText";

// Mock Redux store setup
const rootReducer = combineReducers({
  infoText: infoTextReducer
});
const store = createStore(rootReducer);

describe("useInfoText hook", () => {
  it("should update info text in the store", () => {
    // Render the hook with a mock store
    const { result } = renderHook(() => useInfoText(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    // Set info text using the hook
    act(() => {
      result.current.setInfoTextWithTimeout("Test message", 2000);
    });

    // Get the updated info text from the store
    const state = store.getState();
    expect(state.infoText.infoText).toBe("Test message");

    // Optionally, check that the info text is cleared after timeout
    jest.advanceTimersByTime(2000); // Fast-forward timers
    expect(store.getState().infoText.infoText).toBe("");
  });
});
