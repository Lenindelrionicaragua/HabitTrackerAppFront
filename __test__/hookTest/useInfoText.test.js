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
      infoText: { infoText: "testText" },
      resetTimeoutsIds: { resetTimeoutsIds: [1, 2, 3] }
    });

    store.dispatch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    store.dispatch.mockClear();
  });

  it("should clean the info text and resetTimeoutsIds when clearTimeoutsAndMessage is called", () => {
    const { result } = renderHook(() => useInfoText(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    act(() => {
      result.current.clearTimeoutsAndMessage();
    });

    expect(store.dispatch).toHaveBeenNthCalledWith(1, setResetTimeoutsIds([]));
    expect(store.dispatch).toHaveBeenNthCalledWith(2, setInfoText(""));
  });
});
