import { useState, useRef } from "react";
import { renderHook, act } from "@testing-library/react-hooks";

function startStopwatch() {
  const [initialTime, setInitialTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [timeCompleted, setTimeCompleted] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const startTimer = initialTime => {
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const totalTime = Math.floor((now - startTimeRef.current) / 1000);
      const pausedTime =  totalTime - currentTime;
const elapseTime = 
      const newTime = Math.max(0, initialTime - elapsedTime);
    

      setCurrentTime(newTime);

      if (newTime === 0) {
        clearInterval(intervalRef.current);
        setTimeCompleted(true);
      }

      setElapsedTime(elapsedTime);
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
    jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should decrease the time accurately and consistently", () => {
    const initialTime = 50;
    const { result } = renderHook(() => startStopwatch());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.currentTime).toBe(40);
    expect(result.current.elapsedTime).toBe(10);

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    expect(result.current.currentTime).toBe(0);
    expect(result.current.elapsedTime).toBe(50);
    expect(result.current.timeCompleted).toBe(true);

    expect(clearInterval).toHaveBeenCalled();
  });

  //   it("should start and stop de elapsedTime when de interval is cleaar", () => {
  //     setPauseElapsedTime = 50;

  //     const { result } = renderHook(() => startStopwatch());

  //     act(() => {
  //       result.current.startTimer(initialTime);
  //     });

  //     act(() => {
  //       jest.advanceTimersByTime(10000);
  //     });

  //     expect(result.current.currentTime).toBe(40);
  //     expect(result.current.elapsedTime).toBe(10);

  //     act(() => {
  //       jest.advanceTimersByTime(40000);
  //     });

  //     expect(result.current.currentTime).toBe(0);
  //     expect(result.current.elapsedTime).toBe(50);
  //     expect(result.current.timeCompleted).toBe(true);

  //     expect(clearInterval).toHaveBeenCalled();
  //   });
});
