import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useStopwatch from "../../hooks/useStopwatch";
import useInfoText from "../../hooks/useInfoText";
import { setActivityIndex } from "../../actions/counterActions";

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true, // Needed to use default export
  default: jest.fn()
}));

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

  // it("should decrease the time accurately and consistently", () => {
  //   const initialTime = 50;
  //   store.dispatch({ type: "SET_INITIAL_TIME", payload: initialTime });

  //   const { result } = renderHook(() => useStopwatch(), { wrapper });

  //   act(() => {
  //     result.current.startTimer(initialTime);
  //   });

  //   act(() => {
  //     jest.advanceTimersByTime(10000);
  //   });

  //   expect(result.current.remainingTime).toBe(40);
  //   expect(result.current.elapsedTime).toBe(10);

  //   act(() => {
  //     jest.advanceTimersByTime(40000);
  //   });

  //   expect(result.current.remainingTime).toBe(0);
  //   expect(result.current.elapsedTime).toBe(50);
  //   expect(result.current.timeCompleted).toBe(true);

  //   expect(clearInterval).toHaveBeenCalled();
  // });

  // it("should pause the stopwatch correctly", () => {
  //   const initialTime = 50;
  //   store.dispatch({ type: "SET_INITIAL_TIME", payload: initialTime });

  //   const { result } = renderHook(() => useStopwatch(), { wrapper });

  //   act(() => {
  //     result.current.startTimer(initialTime);
  //   });

  //   act(() => {
  //     jest.advanceTimersByTime(10000);
  //   });

  //   act(() => {
  //     result.current.pauseStopwatch();
  //   });

  //   expect(result.current.isRunning).toBe(false);

  //   const elapsedTimeAfterPause = result.current.elapsedTime;
  //   const remainingTimeAfterPause = result.current.remainingTime;

  //   act(() => {
  //     jest.advanceTimersByTime(10000);
  //   });

  //   expect(result.current.elapsedTime).toBe(elapsedTimeAfterPause);
  //   expect(result.current.remainingTime).toBe(remainingTimeAfterPause);

  //   expect(clearInterval).toHaveBeenCalledTimes(1);
  // });

  // it("should resume the stopwatch correctly", () => {
  //   const initialTime = 50;
  //   store.dispatch({ type: "SET_INITIAL_TIME", payload: initialTime });

  //   const { result } = renderHook(() => useStopwatch(), { wrapper });

  //   act(() => {
  //     result.current.startTimer(initialTime);
  //   });

  //   act(() => {
  //     jest.advanceTimersByTime(10000);
  //   });

  //   act(() => {
  //     result.current.pauseStopwatch();
  //   });

  //   act(() => {
  //     result.current.resumeStopwatch();
  //   });

  //   expect(result.current.isRunning).toBe(true);

  //   act(() => {
  //     jest.advanceTimersByTime(10000);
  //   });

  //   expect(result.current.remainingTime).toBe(30);
  //   expect(result.current.elapsedTime).toBe(20);
  // });

  // it("useStopwatchScreen should set timeCompleted to true when the initial time is completed", () => {
  //   const initialTime = 50;
  //   store.dispatch({ type: "SET_INITIAL_TIME", payload: initialTime });

  //   const { result } = renderHook(() => useStopwatch(), { wrapper });

  //   act(() => {
  //     result.current.startTimer(initialTime);
  //   });

  //   act(() => {
  //     jest.advanceTimersByTime(initialTime * 1000);
  //   });

  //   expect(result.current.isRunning).toBe(false);

  //   expect(result.current.timeCompleted).toBe(true);

  //   expect(result.current.remainingTime).toBe(0);
  //   expect(result.current.elapsedTime).toBe(initialTime);
  // });

  //   it("should call setInfoTextWithTimeout with correct arguments when handleNoActivityNoTime is called", () => {
  //     const dispatch = jest.fn();
  //     const setInfoTextWithTimeout = jest.fn();
  //     const clearTimeoutsAndMessage = jest.fn();

  //     const initialState = {
  //       activityIndex: { activityIndex: null },
  //       initialTime: 300,
  //       resetButtonLabel: { resetButtonLabel: "RESET" },
  //       resetClicks: { resetClicks: 0 },
  //       remainingTime: 0
  //     };

  //     const store = createStore(rootReducer, initialState);

  //     const dispatchSpy = jest.spyOn(store, "dispatch");

  //     useInfoText.mockReturnValue({
  //       setInfoTextWithTimeout,
  //       clearTimeoutsAndMessage
  //     });

  //     const wrapper = ({ children }) => (
  //       <Provider store={store}>{children}</Provider>
  //     );

  //     const { result } = renderHook(() => useStopwatch(), { wrapper });

  //     act(() => {
  //       result.current.handleNoActivityNoTime();
  //     });

  //     expect(setInfoTextWithTimeout).toHaveBeenCalledWith(
  //       "Default time and activity selected.",
  //       5000
  //     );

  //     act(() => {
  //       jest.runAllTimers();
  //     });
  //   });

  //   it("should call setInfoTextWithTimeout with correct arguments when handleActivityNoTime is called", () => {
  //     const dispatch = jest.fn();
  //     const setInfoTextWithTimeout = jest.fn();
  //     const clearTimeoutsAndMessage = jest.fn();

  //     const initialState = {
  //       activityIndex: { activityIndex: null },
  //       initialTime: 300,
  //       resetButtonLabel: { resetButtonLabel: "RESET" },
  //       resetClicks: { resetClicks: 0 },
  //       remainingTime: 0
  //     };

  //     const store = createStore(rootReducer, initialState);

  //     const dispatchSpy = jest.spyOn(store, "dispatch");

  //     useInfoText.mockReturnValue({
  //       setInfoTextWithTimeout,
  //       clearTimeoutsAndMessage
  //     });

  //     const wrapper = ({ children }) => (
  //       <Provider store={store}>{children}</Provider>
  //     );

  //     const { result } = renderHook(() => useStopwatch(), { wrapper });

  //     act(() => {
  //       result.current.handleActivityNoTime();
  //     });

  //     expect(setInfoTextWithTimeout).toHaveBeenCalledWith(
  //       "Default time selected.",
  //       5000
  //     );

  //     act(() => {
  //       jest.runAllTimers();
  //     });
  //   });

  it("should call setInfoTextWithTimeout with correct arguments when handleNoActivityTime is called", () => {
    const dispatch = jest.fn();
    const setInfoTextWithTimeout = jest.fn();
    const clearTimeoutsAndMessage = jest.fn();

    const initialState = {
      activityIndex: { activityIndex: null },
      initialTime: 300,
      resetButtonLabel: { resetButtonLabel: "RESET" },
      resetClicks: { resetClicks: 0 },
      remainingTime: 0
    };

    const store = createStore(rootReducer, initialState);

    const dispatchSpy = jest.spyOn(store, "dispatch");

    useInfoText.mockReturnValue({
      setInfoTextWithTimeout,
      clearTimeoutsAndMessage
    });

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useStopwatch(), { wrapper });

    act(() => {
      result.current.handleNoActivityTime();
    });

    expect(setInfoTextWithTimeout).toHaveBeenCalledWith(
      "Default activity selected.",
      5000
    );

    act(() => {
      jest.runAllTimers();
    });
  });
});
