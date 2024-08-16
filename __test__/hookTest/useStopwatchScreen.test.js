import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useStopwatch from "../../hooks/useStopwatch";

const store = createStore(rootReducer);

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

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
    store.dispatch({ type: "SET_INITIAL_TIME", payload: initialTime });

    const { result } = renderHook(() => useStopwatch(), { wrapper });

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
    store.dispatch({ type: "SET_INITIAL_TIME", payload: initialTime }); // Asegúrate de que esta acción exista y funcione

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      result.current.pauseStopwatch();
    });

    expect(result.current.running).toBe(false);

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
    store.dispatch({ type: "SET_INITIAL_TIME", payload: initialTime }); // Asegúrate de que esta acción exista y funcione

    const { result } = renderHook(() => useStopwatch(), { wrapper });

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

    expect(result.current.running).toBe(true);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(30);
    expect(result.current.elapsedTime).toBe(20);
  });

  it("useStopwatchScreen should set timeCompleted to true when the initial time is completed", () => {
    const initialTime = 50;
    store.dispatch({ type: "SET_INITIAL_TIME", payload: initialTime }); // Asegúrate de que esta acción exista y funcione

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(initialTime * 1000);
    });

    expect(result.current.running).toBe(false);

    expect(result.current.timeCompleted).toBe(true);

    expect(result.current.remainingTime).toBe(0);
    expect(result.current.elapsedTime).toBe(initialTime);
  });
});
