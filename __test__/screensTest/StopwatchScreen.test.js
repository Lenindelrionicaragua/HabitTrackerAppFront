import { useState, useRef } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useInterval } from "../../hooks/useInterval";

const setCircleColor = jest.fn();

function useStopwatchScreen() {
  const [initialTime, setInitialTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeCompleted, setTimeCompleted] = useState(false);
  const [running, setRunning] = useState(false);

  // const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  const startTimer = initialTime => {
    setCircleColor("skyBlue");
    setInitialTime(initialTime);
    startTimeRef.current = Date.now();
    setRunning(true);
  };

  const pauseStopwatch = () => {
    pauseTimeRef.current = Date.now();
    setRunning(false);
  };

  const resumeStopwatch = () => {
    if (!running) {
      const now = Date.now();
      totalPausedTimeRef.current += now - pauseTimeRef.current;
      setRunning(true);
    }
  };

  useInterval(
    () => {
      if (running) {
        const now = Date.now();
        const timePaused = totalPausedTimeRef.current;
        const elapsedTime = (now - startTimeRef.current - timePaused) / 1000;
        const remainingTime = Math.max(0, initialTime - elapsedTime);

        setElapsedTime(elapsedTime);
        setRemainingTime(remainingTime);

        if (remainingTime === 0) {
          setTimeCompleted(true);
          setRunning(false);
        }
      }
    },
    running ? 1000 : null
  );

  return {
    remainingTime,
    elapsedTime,
    timeCompleted,
    running,
    pauseStopwatch,
    resumeStopwatch,
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

  it("should resume the stopwatch correctly", () => {
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

    // Resume the stopwatch
    act(() => {
      result.current.resumeStopwatch();
    });

    // Check if running is set to true
    expect(result.current.running).toBe(true);

    // Advance time by another 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(30);
    expect(result.current.elapsedTime).toBe(20);
  });

  it("useStopwatchScreen should set timeCompleted to true when the initial time is completed", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchScreen());

    // Start the timer with the initial time
    act(() => {
      result.current.startTimer(initialTime);
    });

    // Advance the timer by the full duration of the initial time
    act(() => {
      jest.advanceTimersByTime(initialTime * 1000); // Convert seconds to milliseconds
    });

    // Verify that the timer is not running anymore
    expect(result.current.running).toBe(false);

    // Check if the timer has completed
    expect(result.current.timeCompleted).toBe(true);

    // Verify that the remaining time is 0 and elapsed time is equal to the initial time
    expect(result.current.remainingTime).toBe(0);
    expect(result.current.elapsedTime).toBe(initialTime);
  });
});
