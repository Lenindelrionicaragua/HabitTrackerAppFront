import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useInfoText from "../../hooks/useInfoText";
import { setInfoText } from "../../actions/counterActions";

describe("useInfoText hook", () => {
  it("should update info text in the store", () => {
    const store = createStore(rootReducer);

    const { result } = renderHook(() => useInfoText(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    act(() => {
      result.current.setInfoTextWithTimeout("Test message", 2000);
    });

    const state = store.getState();
    expect(state.infoText.infoText).toBe("Test message");

    jest.advanceTimersByTime(2000);
    expect(store.getState().infoText.infoText).toBe("");
  });
});
