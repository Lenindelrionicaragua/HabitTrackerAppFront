import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../../reducers/rootReducer";
import useSaveTimeRecords from "../../hooks/useSaveTimeRecords";
import { usePerformReset } from "../../hooks/usePerformReset";
import useInfoText from "../../hooks/useInfoText";
import { usePlayAlarm } from "../../hooks/usePlayAlarm";

jest.mock("../../hooks/usePerformReset", () => ({
  usePerformReset: jest.fn()
}));

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true, // Needed to use default export
  default: jest.fn()
}));

jest.mock("../../hooks/usePlayAlarm", () => ({
  usePlayAlarm: jest.fn(() => ({
    playAlarm: jest.fn()
  }))
}));

jest.mock("../../hooks/api/useSaveDailyRecords", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    createDailyRecord: jest.fn(() => Promise.resolve({ success: true })),
    error: null,
    isLoading: false
  }))
}));

describe("useSaveTimeRecords", () => {
  let dispatchSpy;
  let updateInfoText;
  let clearTimeoutsAndMessage;
  let playAlarm;
  let performReset;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    updateInfoText = jest.fn();
    clearTimeoutsAndMessage = jest.fn();
    playAlarm = jest.fn();
    performReset = jest.fn();

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    usePlayAlarm.mockReturnValue({
      playAlarm
    });

    usePerformReset.mockReturnValue(performReset);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const initializeStore = initialState => {
    return configureStore({
      reducer: rootReducer,
      preloadedState: initialState
    });
  };

  it("saveTimeRecords should call clearTimeoutsAndMessage, and setIsRunning to false, when the timer is running", async () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: false },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 },
      metricsUpdate: { needsMetricsUpdate: false }
    };

    const store = initializeStore(initialState);

    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    await act(async () => {
      await result.current.saveTimeRecords();
    });

    expect(useInfoText().clearTimeoutsAndMessage).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "SET_IS_RUNNING",
      payload: false
    });
  });

  it("saveTimeRecords should call updateInfoText with the right arguments when the time is 0 and firstRun is false", async () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: false },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 },
      metricsUpdate: { needsMetricsUpdate: false }
    };

    const store = initializeStore(initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    await act(async () => {
      await result.current.saveTimeRecords();
    });

    expect(useInfoText().updateInfoText).toHaveBeenCalledWith(
      "No time recorded. Please start the timer before saving."
    );
  });

  it("saveTimeRecords should not call processSaveAndUpdateUI if remaining time is 0 and firstRun is false", async () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: false },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 },
      metricsUpdate: { needsMetricsUpdate: false }
    };

    const store = initializeStore(initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    await act(async () => {
      await result.current.saveTimeRecords();
    });

    expect(performReset).not.toHaveBeenCalled();
  });

  it("saveTimeRecords should call performReset if remaining time is greater than 0 and firstRun is true", async () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 10 },
      firstRun: { firstRun: true },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 },
      metricsUpdate: { needsMetricsUpdate: false }
    };

    const store = initializeStore(initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    usePerformReset.mockReturnValue(performReset);

    await act(async () => {
      await result.current.saveTimeRecords();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(useInfoText().updateInfoText).toHaveBeenCalledWith(
      "Time saved successfully"
    );
    expect(performReset).toHaveBeenCalled();
  });

  it("saveTimeRecords should not call performReset if time is not completed or remaining time is 0", async () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: false },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 },
      metricsUpdate: { needsMetricsUpdate: false }
    };

    const store = initializeStore(initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    usePerformReset.mockReturnValue(performReset);

    await act(async () => {
      await result.current.saveTimeRecords();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(performReset).not.toHaveBeenCalled();
  });

  it("processSaveAndUpdateUI should call performReset", async () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: true },
      timeCompleted: { timeCompleted: true },
      elapsedTime: { elapsedTime: 0 },
      metricsUpdate: { needsMetricsUpdate: false }
    };

    const store = initializeStore(initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    usePerformReset.mockReturnValue(performReset);

    await act(async () => {
      await result.current.processSaveAndUpdateUI();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(performReset).toHaveBeenCalled();
  });

  it("processSaveAndUpdateUI should call playAlarm if time is not completed", async () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: true },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 },
      metricsUpdate: { needsMetricsUpdate: false }
    };

    const store = initializeStore(initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    usePerformReset.mockReturnValue(performReset);

    await act(async () => {
      await result.current.processSaveAndUpdateUI();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(playAlarm).toHaveBeenCalled();
  });
});
