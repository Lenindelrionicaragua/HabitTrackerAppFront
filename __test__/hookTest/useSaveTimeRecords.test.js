import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useSaveTimeRecords from "../../hooks/useSaveTimeRecords";
import { usePerformReset } from "../../hooks/usePerformReset";
import useInfoText from "../../hooks/useInfoText";
import {
  setIsRunning,
  setSaveTimeButtonLabel,
  setButtonsDisabled
} from "../../actions/counterActions";

// Mock de hooks
jest.mock("../../hooks/usePerformReset", () => ({
  usePerformReset: jest.fn()
}));

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true, // Needed to use default export
  default: jest.fn(() => ({
    updateInfoText: jest.fn(),
    clearTimeoutsAndMessage: jest.fn()
  }))
}));

describe("useSaveTimeRecords", () => {
  let store;
  let dispatchSpy;

  beforeEach(() => {
    jest.useFakeTimers();

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

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("saveTimeRecords should call clearTimeoutsAndMessage, and setIsRunning to false, when the timer is running", () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useSaveTimeRecords(), { wrapper });

    act(() => {
      result.current.saveTimeRecords();
    });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "SET_IS_RUNNING",
      payload: false
    });
  });
});
