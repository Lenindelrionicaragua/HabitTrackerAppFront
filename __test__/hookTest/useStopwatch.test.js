import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useStopwatch from "../../hooks/useStopwatch";
import useInfoText from "../../hooks/useInfoText";
import {
  setActivityIndex,
  setIsRunning,
  setHasStarted,
  setFirstRun,
  setRemainingTime,
  setInitialTime,
  setTimeCompleted
} from "../../actions/counterActions";

jest.mock("../../hooks/useInfoText", () => ({
  __esModule: true, // Needed to use default export
  default: jest.fn()
}));

const store = createStore(rootReducer);

const wrapper = ({ children }) => (
  <Provider store={createStore(rootReducer)}>{children}</Provider>
);

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

  //   it("should call setInfoTextWithTimeout with correct arguments when handleNoActivityNoTime is called", () => {
  //     const setInfoTextWithTimeout = jest.fn();
  //     const clearTimeoutsAndMessage = jest.fn();

  //     const initialState = {
  //       activityIndex: { activityIndex: null },
  //       initialTime: 300,
  //       remainingTime: 300
  //     };

  //     const store = createStore(rootReducer, initialState);

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
  //     const setInfoTextWithTimeout = jest.fn();
  //     const clearTimeoutsAndMessage = jest.fn();

  //     const initialState = {
  //       activityIndex: { activityIndex: null },
  //       initialTime: { initialTime: 300 },
  //       remainingTime: { remainingTime: 300 },
  //       isRunning: { isRunning: false },
  //       firstRun: { firstRun: false },
  //       hasStarted: { hasStarted: false }
  //     };

  //     const store = createStore(rootReducer, initialState);

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

  //   it("should call setInfoTextWithTimeout with correct arguments when handleNoActivityTime is called", () => {
  //     const setInfoTextWithTimeout = jest.fn();
  //     const clearTimeoutsAndMessage = jest.fn();

  //     const initialState = {
  //       activityIndex: { activityIndex: null },
  //       initialTime: 300,
  //       remainingTime: 0
  //     };

  //     const store = createStore(rootReducer, initialState);

  //     useInfoText.mockReturnValue({
  //       setInfoTextWithTimeout,
  //       clearTimeoutsAndMessage
  //     });

  //     const wrapper = ({ children }) => (
  //       <Provider store={store}>{children}</Provider>
  //     );

  //     const { result } = renderHook(() => useStopwatch(), { wrapper });

  //     act(() => {
  //       result.current.handleNoActivityTime();
  //     });

  //     expect(setInfoTextWithTimeout).toHaveBeenCalledWith(
  //       "Default activity selected.",
  //       5000
  //     );

  //     act(() => {
  //       jest.runAllTimers();
  //     });
  //   });

  //   it("should call setIsRunning, setFirsRun and setHasStarted with TRUE, when ActivityTime is called", () => {
  //     const dispatch = jest.fn();
  //     const setInfoTextWithTimeout = jest.fn();
  //     const clearTimeoutsAndMessage = jest.fn();

  //     const initialState = {
  //       activityIndex: { activityIndex: null },
  //       initialTime: { initialTime: 300 },
  //       remainingTime: { remainingTime: 300 },
  //       isRunning: { isRunning: false },
  //       firstRun: { firstRun: false },
  //       hasStarted: { hasStarted: false }
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
  //       result.current.handleActivityTime();
  //     });

  //     expect(store.dispatch).toHaveBeenNthCalledWith(2, setIsRunning(true));
  //     expect(store.dispatch).toHaveBeenNthCalledWith(4, setFirstRun(true));
  //     expect(store.dispatch).toHaveBeenNthCalledWith(5, setHasStarted(true));

  //     act(() => {
  //       jest.advanceTimersByTime(5000);
  //     });
  //   });

  //   it("should call startTimer, when HandleActivityTime is called", () => {
  //     const setInfoTextWithTimeout = jest.fn();
  //     const clearTimeoutsAndMessage = jest.fn();
  //     useInfoText.mockReturnValue({
  //       setInfoTextWithTimeout,
  //       clearTimeoutsAndMessage
  //     });

  //     const initialState = {
  //       activityIndex: { activityIndex: null },
  //       initialTime: { initialTime: 300 },
  //       remainingTime: { remainingTime: 300 },
  //       isRunning: { isRunning: false },
  //       firstRun: { firstRun: false },
  //       hasStarted: { hasStarted: false }
  //     };

  //     const store = createStore(rootReducer, initialState);

  //     const wrapper = ({ children }) => (
  //       <Provider store={store}>{children}</Provider>
  //     );

  //     const { result } = renderHook(() => useStopwatch(), { wrapper });
  //     const startTimerMock = jest.fn();
  //     result.current.startTimer = startTimerMock;

  //     act(() => {
  //       result.current.handleActivityTime();
  //     });

  //     expect(startTimerMock).toHaveBeenCalledWith(300);
  //     console.log("startTimerMock calls:", startTimerMock.mock.calls);
  //   });
});
