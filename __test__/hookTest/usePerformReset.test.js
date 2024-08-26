import { renderHook, act } from "@testing-library/react-hooks";
import { useDispatch } from "react-redux";
import { usePerformReset } from "../../hooks/usePerformReset";
import {
  setInitialTime,
  setRemainingTime,
  setElapsedTime,
  setIsRunning,
  setActivityIndex,
  setHasStarted,
  setFirstRun,
  setResetClicks,
  setButtonsDisabled,
  setResetButtonLabel,
  setSaveTimeButtonLabel,
  setTimeCompleted
} from "../../actions/counterActions";
import useUpdateCircleColors from "../../hooks/useUpdateCircleColors";

// Mock the dispatch function and actions
jest.mock("react-redux", () => ({
  useDispatch: jest.fn()
}));

jest.mock("../../hooks/useUpdateCircleColors", () => ({
  __esModule: true, // This is important for proper mocking of ES modules
  useUpdateCircleColors: () => ({
    updateColors: jest.fn()
  })
}));

jest.mock("../../actions/counterActions", () => ({
  setInitialTime: jest.fn(),
  setRemainingTime: jest.fn(),
  setElapsedTime: jest.fn(),
  setIsRunning: jest.fn(),
  setActivityIndex: jest.fn(),
  setHasStarted: jest.fn(),
  setFirstRun: jest.fn(),
  setResetClicks: jest.fn(),
  setButtonsDisabled: jest.fn(),
  setResetButtonLabel: jest.fn(),
  setSaveTimeButtonLabel: jest.fn(),
  setTimeCompleted: jest.fn()
}));

describe("usePerformReset", () => {
  it("should dispatch setInitialTime with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setInitialTime(0));
  });
});
