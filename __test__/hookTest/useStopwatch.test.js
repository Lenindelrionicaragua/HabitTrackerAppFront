import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useStopwatch from "../../hooks/useStopwatch";
import useInfoText from "../../hooks/useInfoText";
import {
  setHabitCategoryIndex,
  setIsRunning,
  setHasStarted,
  setFirstRun,
  setRemainingTime,
  setInitialTime,
  setTimeCompleted
} from "../../actions/counterActions";

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true, // Needed to use default export
  default: jest.fn()
}));

const store = createStore(rootReducer);

const wrapper = ({ children }) => (
  <Provider store={createStore(rootReducer)}>{children}</Provider>
);

describe("useStopwatchScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should call setInfoTextWithTimeout with correct arguments when handleNoHabitCategoryNoTime is called", () => {
    const updateInfoText = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      habitCategoryIndex: { habitCategoryIndex: null },
      initialTime: 300,
      remainingTime: 300
    };

    const store = createStore(rootReducer, initialState);

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleNoHabitCategoryNoTime();
    });

    expect(updateInfoText).toHaveBeenCalledWith(
      "Default time and habit category selected."
    );

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should call setInfoTextWithTimeout with correct arguments when handleHabitCategoryNoTime is called", () => {
    const updateInfoText = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      habitCategoryIndex: { habitCategoryIndex: null },
      initialTime: { initialTime: 300 },
      remainingTime: { remainingTime: 300 },
      isRunning: { isRunning: false },
      firstRun: { firstRun: false },
      hasStarted: { hasStarted: false }
    };

    const store = createStore(rootReducer, initialState);

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleHabitCategoryNoTime();
    });

    expect(updateInfoText).toHaveBeenCalledWith("Default time selected.");

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should call updateInfoText with correct arguments when handleNoHabitCategoryTime is called", () => {
    const updateInfoText = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      habitCategoryIndex: { habitCategoryIndex: null },
      initialTime: 300,
      remainingTime: 0
    };

    const store = createStore(rootReducer, initialState);

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleNoHabitCategoryTime();
    });

    expect(updateInfoText).toHaveBeenCalledWith(
      "Default habit category selected."
    );

    act(() => {
      jest.runAllTimers();
    });
  });

  it("should call setIsRunning, setFirstRun, and setHasStarted with TRUE when handleHabitCategoryTime is called", () => {
    const dispatch = jest.fn();
    const updateInfoText = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      habitCategoryIndex: { habitCategoryIndex: null },
      initialTime: { initialTime: 300 },
      remainingTime: { remainingTime: 300 },
      isRunning: { isRunning: false },
      firstRun: { firstRun: false },
      hasStarted: { hasStarted: false }
    };

    const store = createStore(rootReducer, initialState);

    const dispatchSpy = jest.spyOn(store, "dispatch");

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleHabitCategoryTime();
    });

    expect(store.dispatch).toHaveBeenNthCalledWith(3, setFirstRun(true));
    expect(store.dispatch).toHaveBeenNthCalledWith(4, setHasStarted(true));

    act(() => {
      jest.advanceTimersByTime(5000);
    });
  });
});
