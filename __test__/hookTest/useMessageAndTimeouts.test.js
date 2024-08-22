import React from "react";
import configureStore from "redux-mock-store";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import useMessageAndTimeouts from "../../hooks/useMessageAndTimeouts";
import { setInfoText, setResetTimeoutsIds } from "../../actions/counterActions";

const mockStore = configureStore([]);

describe("useMessageAndTimeouts hook", () => {
  let store;
  let clearTimeoutMock;

  beforeEach(() => {
    store = mockStore({
      resetTimeoutsIds: []
    });
    jest.useFakeTimers();
    clearTimeoutMock = jest.spyOn(global, "clearTimeout");
    jest.spyOn(global, "setTimeout");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should clear all timeouts and reset info text", () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useMessageAndTimeouts(), { wrapper });

    // Set some initial timeouts
    const initialTimeoutIds = [
      setTimeout(() => {}, 1000),
      setTimeout(() => {}, 2000)
    ];
    store.dispatch(setResetTimeoutsIds(initialTimeoutIds));

    // Call the function to clear messages and timeouts
    act(() => {
      result.current.clearMessagesAndTimeouts();
    });

    // Verify that the store actions are dispatched correctly
    const actions = store.getActions();
    expect(actions).toContainEqual(setInfoText(""));
    expect(actions).toContainEqual(setResetTimeoutsIds([]));

    // Verify that the timeouts were cleared
    initialTimeoutIds.forEach(id => {
      expect(clearTimeoutMock).toHaveBeenCalledWith(id);
    });
  });

  it("should schedule a new timeout if a delay is provided", () => {
    const delay = 5000;
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useMessageAndTimeouts(), { wrapper });

    // Call the function with a delay
    act(() => {
      result.current.scheduleInfoTextClearInStore(delay);
    });

    // Verify that the timeout was scheduled
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), delay);

    // Verify the store is updated with the new timeout ID
    const actions = store.getActions();
    expect(actions).toContainEqual(setInfoText(""));
    expect(actions).toContainEqual(setResetTimeoutsIds(expect.any(Array)));

    // Simulate the passage of time
    jest.advanceTimersByTime(delay);

    // Verify the timeout was executed
    const newActions = store.getActions();
    expect(newActions).toContainEqual(setInfoText(""));
    expect(newActions).toContainEqual(setResetTimeoutsIds([]));
  });
});
