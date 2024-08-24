import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useResetStopwatch from "../../hooks/useResetStopwatch";
import { usePerformReset } from "../../hooks/usePerformReset";
import useInfoText from "../../hooks/useInfoText";

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
