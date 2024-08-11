import { useState, useRef } from "react";
import { renderHook, act } from "@testing-library/react-hooks";

const setCircleColor = jest.fn();

function useStopwatchScreen() {
  const [initialTime, setInitialTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeCompleted, setTimeCompleted] = useState(false);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const startTimer = initialTime => {
    setCircleColor("skyBlue");
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedTime = Math.floor((now - startTimeRef.current) / 1000);
      const newRemainingTime = Math.max(0, initialTime - elapsedTime);

      setRemainingTime(newRemainingTime);

      if (newRemainingTime === 0) {
        clearInterval(intervalRef.current);
        setTimeCompleted(true);
      }

      setElapsedTime(elapsedTime);
    }, 1000);
  };

  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false); // Set running to false when the timer is paused
  };

  return {
    remainingTime,
    elapsedTime,
    timeCompleted,
    running,
    pauseStopwatch,
    startTimer
  };
}

export default useStopwatchScreen;

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

  it("should decrease the time accurately and consistently", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchScreen());

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
    const { result } = renderHook(() => useStopwatchScreen());

    act(() => {
      result.current.startTimer(initialTime);
    });

    // Advance the timer by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Pause the stopwatch
    act(() => {
      result.current.pauseStopwatch();
    });

    // Check if running is set to false
    expect(result.current.running).toBe(false);

    const elapsedTimeAfterPause = result.current.elapsedTime;
    const remainingTimeAfterPause = result.current.remainingTime;

    // Advance time by another 10 seconds, which should not affect elapsedTime or remainingTime
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.elapsedTime).toBe(elapsedTimeAfterPause);
    expect(result.current.remainingTime).toBe(remainingTimeAfterPause);

    // Ensure clearInterval was called exactly once
    expect(clearInterval).toHaveBeenCalledTimes(1);
  });
});
