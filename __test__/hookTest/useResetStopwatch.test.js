import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useResetStopwatch from "../../hooks/useResetStopwatch";
import { usePerformReset } from "../../hooks/usePerformReset";
import useInfoText from "../../hooks/useInfoText";
import {
  setResetButtonLabel,
  setResetClicks
} from "../../actions/counterActions";

// Mock de hooks
jest.mock("../../hooks/usePerformReset", () => ({
  usePerformReset: jest.fn()
}));

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true, // Needed to use default export
  default: jest.fn()
}));

describe("useResetStopwatch", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should call setInfoTextWithTimeout with correct arguments when handleResetClicksZero is called and remainingTime is 0", () => {
    const dispatch = jest.fn();
    const updateButtonLabel = jest.fn();
    const setInfoTextWithTimeout = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      resetButtonLabel: { resetButtonLabel: "RESET" },
      resetClicks: { resetClicks: 0 },
      remainingTime: 0
    };

    const store = createStore(rootReducer, initialState);

    const dispatchSpy = jest.spyOn(store, "dispatch");

    useInfoText.mockReturnValue({
      setInfoTextWithTimeout,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useResetStopwatch(), { wrapper });

    act(() => {
      result.current.handleResetClicksZero();
    });

    expect(store.dispatch).toHaveBeenNthCalledWith(
      1,
      setResetButtonLabel("RESET")
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(setInfoTextWithTimeout).toHaveBeenCalledWith(
      "The timer is already at zero. Do you want to reset it?",
      10000
    );
  });

  it("should call setInfoTextWithTimeout with correct arguments when handleResetClicksZero is called and remainingTime is not 0", () => {
    const dispatch = jest.fn();
    const setInfoTextWithTimeout = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      resetButtonLabel: { resetButtonLabel: "RESET" },
      resetClicks: { resetClicks: 0 },
      remainingTime: 10
    };

    const store = createStore(rootReducer, initialState);

    const dispatchSpy = jest.spyOn(store, "dispatch");

    useInfoText.mockReturnValue({
      setInfoTextWithTimeout,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useResetStopwatch(), { wrapper });

    act(() => {
      result.current.handleResetClicksZero();
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(setInfoTextWithTimeout).toHaveBeenCalledWith(
      "Are you sure you want to reset the stopwatch?",
      10000
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(setInfoTextWithTimeout).toHaveBeenCalledWith(
      "Reset cancelled.",
      12000
    );
    expect(dispatchSpy).toHaveBeenNthCalledWith(4, {
      type: "SET_RESET_CLICKS",
      payload: 0
    });
  });

  it("should call performReset when handleResetClicksOne is called and remainingTime is not 0", () => {
    const dispatch = jest.fn();
    const performReset = jest.fn();
    const setInfoTextWithTimeout = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      resetButtonLabel: { resetButtonLabel: "RESET" },
      resetClicks: { resetClicks: 1 },
      remainingTime: 10
    };

    const store = createStore(rootReducer, initialState);

    usePerformReset.mockReturnValue(performReset);
    useInfoText.mockReturnValue({
      setInfoTextWithTimeout,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useResetStopwatch(), { wrapper });

    act(() => {
      result.current.handleResetClicksOne();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(performReset).toHaveBeenCalled();
    expect(setInfoTextWithTimeout).toHaveBeenCalled();
  });

  it("should call performReset when handleResetClicksTwoOrMore is called and remainingTime is not 0", () => {
    const dispatch = jest.fn();
    const performReset = jest.fn();
    const setInfoTextWithTimeout = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      resetButtonLabel: { resetButtonLabel: "RESET" },
      resetClicks: { resetClicks: 2 },
      remainingTime: 10
    };

    const store = createStore(rootReducer, initialState);

    usePerformReset.mockReturnValue(performReset);
    useInfoText.mockReturnValue({
      setInfoTextWithTimeout,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useResetStopwatch(), { wrapper });

    act(() => {
      result.current.handleResetClicksTwoOrMore();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(performReset).toHaveBeenCalled();
    expect(setInfoTextWithTimeout).toHaveBeenCalled();
  });
});
