import { useState, useRef } from "react";
import { renderHook, act } from "@testing-library/react-hooks";

const setCircleColor = jest.fn();

function startStopwatch() {
  const [initialTime, setInitialTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeCompleted, setTimeCompleted] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const startTimer = initialTime => {
    setCircleColor("skyBlue");
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setCurrentTime(prevTime => {
        const newTime = Math.max(
          0,
          initialTime - Math.floor((Date.now() - startTimeRef.current) / 1000)
        );

        if (newTime === 0) {
          clearInterval(intervalRef.current);
          setTimeCompleted(true);

          return newTime;
        }

        return newTime;
      });

      setElapsedTime(prevElapsedTime => {
        if (currentTime === 0) {
          return 0;
        }
        return prevElapsedTime + 1;
      });
    }, 1000);
  };

  return {
    currentTime,
    elapsedTime,
    timeCompleted,
    startTimer
  };
}

export default startStopwatch;

describe("startTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should decrease the time accurately and consistently", () => {
    const initialTime = 3000;
    const { result } = renderHook(() => startStopwatch());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(590);
    });

    expect(result.current.currentTime).toBe(2410);
    expect(result.current.elapsedTime).toBe(590);

    act(() => {
      jest.advanceTimersByTime(2410);
    });

    expect(result.current.currentTime).toBe(0);
    expect(result.current.elapsedTime).toBe(3000);
    expect(result.current.timeCompleted).toBe(true);

    expect(clearInterval).toHaveBeenCalled();
  });
});
