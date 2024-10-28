import { renderHook, act } from "@testing-library/react-hooks";
import { useDispatch } from "react-redux";
import { usePerformReset } from "../../hooks/usePerformReset";
import {
  setInitialTime,
  setRemainingTime,
  setElapsedTime,
  setIsRunning,
  setHabitCategoryIndex,
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
  __esModule: true,
  default: jest.fn(() => ({
    updateColors: jest.fn()
  }))
}));

jest.mock("../../actions/counterActions", () => ({
  setInitialTime: jest.fn(),
  setRemainingTime: jest.fn(),
  setElapsedTime: jest.fn(),
  setIsRunning: jest.fn(),
  setHabitCategoryIndex: jest.fn(),
  setHasStarted: jest.fn(),
  setFirstRun: jest.fn(),
  setResetClicks: jest.fn(),
  setButtonsDisabled: jest.fn(),
  setResetButtonLabel: jest.fn(),
  setSaveTimeButtonLabel: jest.fn(),
  setTimeCompleted: jest.fn()
}));

describe("usePerformReset", () => {
  // setInitialTime
  it("should dispatch setInitialTime with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setInitialTime(0));
  });

  // setRemainingTime
  it("should dispatch setRemainingTime with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setRemainingTime(0));
  });

  // setElapsedTime
  it("should dispatch setElapsedTime with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setElapsedTime(0));
  });

  // setIsRunning
  it("should dispatch setIsRunning with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setIsRunning(0));
  });

  it("should dispatch setHabitCategoryIndex with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setHabitCategoryIndex(0));
  });

  // setHasStarted
  it("should dispatch setHasStarted with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setHasStarted(0));
  });

  // setFirstRun
  it("should dispatch setFirstRun with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setFirstRun(0));
  });

  // setResetClicks
  it("should dispatch setResetClicks with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setResetClicks(0));
  });

  // setButtonsDisabled
  it("should dispatch setButtonsDisabled with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setButtonsDisabled(0));
  });

  // setResetButtonLabel
  it("should dispatch setResetButtonLabel with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setResetButtonLabel(0));
  });

  // setSaveTimeButtonLabel
  it("should dispatch setSaveTimeButtonLabel with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setSaveTimeButtonLabel(0));
  });

  // setTimeCompleted
  it("should dispatch setTimeCompleted with 0", () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(dispatch).toHaveBeenCalledWith(setTimeCompleted(0));
  });

  it("should call updateColors function", () => {
    const updateColors = jest.fn();

    useUpdateCircleColors.mockReturnValue({ updateColors });

    const { result } = renderHook(() => usePerformReset());

    act(() => {
      result.current();
    });

    expect(updateColors).toHaveBeenCalled();
  });
});
