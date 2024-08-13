import { renderHook, act } from "@testing-library/react-hooks";
import { render, cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import StopwatchScreen from "../../screens/StopwatchScreen/StopwatchScreen";

// Setup fake timers for Jest
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  cleanup();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("StopwatchScreen", () => {
  it("should decrease the time accurately and consistently", () => {
    const initialTime = 50;

    // Render the component and simulate starting the timer
    const { getByText } = render(<StopwatchScreen />);
    const { result } = renderHook(() => StopwatchScreen());

    // Start the timer
    act(() => {
      result.current.startTimer(initialTime);
    });

    // Simulate 10 seconds passing
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(40);
    expect(result.current.elapsedTime).toBe(10);

    // Simulate another 40 seconds passing
    act(() => {
      jest.advanceTimersByTime(40000);
    });

    expect(result.current.remainingTime).toBe(0);
    expect(result.current.elapsedTime).toBe(50);
    expect(result.current.timeCompleted).toBe(true);
  });

  it("should pause the stopwatch correctly", () => {
    const initialTime = 50;

    // Render the component and simulate starting the timer
    const { getByText } = render(<StopwatchScreen />);
    const { result } = renderHook(() => StopwatchScreen());

    // Start the timer
    act(() => {
      result.current.startTimer(initialTime);
    });

    // Simulate 10 seconds passing
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Pause the stopwatch
    act(() => {
      result.current.pauseStopwatch();
    });

    // Verify the stopwatch is paused
    expect(result.current.running).toBe(false);

    const elapsedTimeAfterPause = result.current.elapsedTime;
    const remainingTimeAfterPause = result.current.remainingTime;

    // Simulate another 10 seconds passing, should not affect times
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.elapsedTime).toBe(elapsedTimeAfterPause);
    expect(result.current.remainingTime).toBe(remainingTimeAfterPause);
  });
});
