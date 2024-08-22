import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import useInfoText from "../../hooks/useInfoText";
import { setInfoText, setResetTimeoutsIds } from "../../actions/counterActions";

const mockStore = configureStore([]);

describe("useInfoText hook with mock store", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      infoText: { infoText: "" },
      resetTimeoutsIds: { resetTimeoutsIds: [] }
    });

    store.dispatch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should update info text in the store", () => {
    const { result } = renderHook(() => useInfoText(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    act(() => {
      result.current.setInfoTextWithTimeout("Test message", 2000);
    });

    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      setInfoText("Test message")
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(store.dispatch).toHaveBeenNthCalledWith(3, setInfoText(""));
  });
});
