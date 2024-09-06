import { renderHook, act } from "@testing-library/react-hooks";
import useStopwatchLogicMock from "../../__mocks__/useStopwatchLogicMock";

describe("useStopwatch", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should decrease the time accurately and consistently", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(40);
    expect(result.current.elapsedTime).toBe(10);

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    expect(result.current.remainingTime).toBe(0);
    expect(result.current.elapsedTime).toBe(50);
    expect(result.current.timeCompleted).toBe(true);

    expect(clearInterval).toHaveBeenCalled();
  });

  it("should pause the stopwatch correctly", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      result.current.pauseStopwatch();
    });

    expect(result.current.isRunning).toBe(false);

    const elapsedTimeAfterPause = result.current.elapsedTime;
    const remainingTimeAfterPause = result.current.remainingTime;

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.elapsedTime).toBe(elapsedTimeAfterPause);
    expect(result.current.remainingTime).toBe(remainingTimeAfterPause);

    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it("should resume the stopwatch correctly", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      result.current.pauseStopwatch();
    });

    act(() => {
      result.current.resumeStopwatch();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(30);
    expect(result.current.elapsedTime).toBe(20);
  });

  it("should set timeCompleted to true when the initial time is completed", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(initialTime * 1000);
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.timeCompleted).toBe(true);
    expect(result.current.remainingTime).toBe(0);
    expect(result.current.elapsedTime).toBe(initialTime);
  });

  it("should handle rapid multiple resume and pause calls correctly", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.pauseStopwatch();
        jest.advanceTimersByTime(50);
      });

      act(() => {
        result.current.resumeStopwatch();
        jest.advanceTimersByTime(50);
      });
    }

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.isRunning).toBe(true);

    expect(result.current.elapsedTime).toBeCloseTo(1, 0.1);

    expect(result.current.remainingTime).toBeCloseTo(initialTime - 1, 1);
  });
});
