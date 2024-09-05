import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useSaveTimeRecords from "../../hooks/useSaveTimeRecords";
import { usePerformReset } from "../../hooks/usePerformReset";
import useInfoText from "../../hooks/useInfoText";
import { usePlayAlarm } from "../../hooks/usePlayAlarm";

jest.mock("../../hooks/usePerformReset", () => ({
  usePerformReset: jest.fn()
}));

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../../hooks/usePlayAlarm", () => ({
  usePlayAlarm: jest.fn()
}));

describe("useSaveTimeRecords", () => {
  let store;
  let dispatchSpy;
  let updateInfoText;
  let clearTimeoutsAndMessage;
  let processSaveAndUpdateUI;

  beforeEach(() => {
    jest.useFakeTimers();

    updateInfoText = jest.fn();
    clearTimeoutsAndMessage = jest.fn();
    playAlarm = jest.fn();

    useInfoText.mockReturnValue({
      updateInfoText,
      clearTimeoutsAndMessage
    });

    jest.mock("../../hooks/usePlayAlarm", () => ({
      usePlayAlarm: jest.fn(() => ({
        playAlarm: jest.fn()
      }))
    }));

    jest.clearAllMocks();

    processSaveAndUpdateUI = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("saveTimeRecords should call clearTimeoutsAndMessage, and setIsRunning to false, when the timer is running", () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: false },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 }
    };

    store = createStore(rootReducer, initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    act(() => {
      result.current.saveTimeRecords();
    });

    expect(useInfoText().clearTimeoutsAndMessage).toHaveBeenCalled();

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "SET_IS_RUNNING",
      payload: false
    });
  });

  it("saveTimeRecords should call updateInfoText with the right arguments when the time es 0 and firstRun is false", () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: false },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 }
    };

    store = createStore(rootReducer, initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    act(() => {
      result.current.saveTimeRecords();
    });

    expect(useInfoText().updateInfoText).toHaveBeenCalledWith(
      "No time recorded. Please start the timer before saving."
    );
  });

  it("saveTimeRecords should not call processSaveAndUpdateUI if remaining time is 0 and firstRun is false", () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 0 },
      firstRun: { firstRun: false },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 }
    };

    store = createStore(rootReducer, initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    act(() => {
      result.current.saveTimeRecords();
    });

    expect(processSaveAndUpdateUI).not.toHaveBeenCalled();
  });

  it("saveTimeRecords should call processSaveAndUpdateUI if remaining time is 0 and firstRun is false", () => {
    const initialState = {
      isRunning: { isRunning: true },
      saveTimeButtonLabel: { saveTimeButtonLabel: "SAVE-TIME" },
      buttonsDisabled: { buttonsDisabled: false },
      remainingTime: { remainingTime: 10 },
      firstRun: { firstRun: true },
      timeCompleted: { timeCompleted: false },
      elapsedTime: { elapsedTime: 0 }
    };

    store = createStore(rootReducer, initialState);
    dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    act(() => {
      result.current.saveTimeRecords();
    });

    expect(processSaveAndUpdateUI).toHaveBeenCalled();
  });
});
