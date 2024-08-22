import { act } from "@testing-library/react-hooks";
import {
  clearMessagesAndTimeouts,
  scheduleInfoTextClear
} from "../../util/messageAndTimeoutHandlers";

describe("clearMessagesAndTimeouts", () => {
  it("should clear all timeouts and reset state", () => {
    const mockClearTimeout = jest.spyOn(global, "clearTimeout");
    const timeoutIds = [1, 2, 3];
    const setTimeoutIds = jest.fn();
    const setInfoText = jest.fn();

    // Call the function to clear messages and timeouts
    clearMessagesAndTimeouts(timeoutIds, setTimeoutIds, setInfoText);

    // Verify that clearTimeout was called for each ID
    timeoutIds.forEach(id => {
      expect(mockClearTimeout).toHaveBeenCalledWith(id);
    });

    expect(setTimeoutIds).toHaveBeenCalledWith([]);

    expect(setInfoText).toHaveBeenCalledWith("");

    mockClearTimeout.mockRestore();
  });

  it("should throw an error if timeoutIds is not an array", () => {
    const setTimeoutIds = jest.fn();
    const setInfoText = jest.fn();

    expect(() => {
      clearMessagesAndTimeouts(null, setTimeoutIds, setInfoText);
    }).toThrow(TypeError);

    expect(() => {
      clearMessagesAndTimeouts({}, setTimeoutIds, setInfoText);
    }).toThrow(TypeError);

    expect(() => {
      clearMessagesAndTimeouts("string", setTimeoutIds, setInfoText);
    }).toThrow(TypeError);

    expect(() => {
      clearMessagesAndTimeouts(123, setTimeoutIds, setInfoText);
    }).toThrow(TypeError);
  });
});

describe("scheduleInfoTextClear", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should set a delay and a timeout ID to clear the info text", () => {
    const delay = 5000;
    const setInfoText = jest.fn();
    const setTimeoutIds = jest.fn();
    const timeoutIds = [1, 2, 3];

    const mockSetTimeout = jest.spyOn(global, "setTimeout");

    // Call the function to schedule clearing the info text
    scheduleInfoTextClear(delay, setInfoText, setTimeoutIds, timeoutIds);

    // Verify that setTimeout was called with a function and the delay
    expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), delay);

    // Get the timeout ID returned by setTimeout
    const timeoutId = mockSetTimeout.mock.results[0].value;

    // Extract the function passed to setTimeoutIds and verify it updates timeout IDs
    const updateFunction = setTimeoutIds.mock.calls[0][0];
    const updatedTimeoutIds = updateFunction(timeoutIds);
    expect(updatedTimeoutIds).toEqual(expect.arrayContaining([timeoutId]));

    // Advance timers by the specified delay
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Verify that setInfoText was called with an empty string after the delay
    expect(setInfoText).toHaveBeenCalledWith("");

    // Restore the original implementation of setTimeout
    mockSetTimeout.mockRestore();
  });

  it("should throw an error if setTimeoutIds or setInfoText are not functions", () => {
    const timeoutIds = [1, 2, 3];

    expect(() => {
      clearMessagesAndTimeouts(timeoutIds, null, () => {});
    }).toThrow(TypeError);

    expect(() => {
      clearMessagesAndTimeouts(timeoutIds, () => {}, null);
    }).toThrow(TypeError);

    expect(() => {
      clearMessagesAndTimeouts(timeoutIds, "string", () => {});
    }).toThrow(TypeError);

    expect(() => {
      clearMessagesAndTimeouts(timeoutIds, () => {}, "string");
    }).toThrow(TypeError);
  });
});
const mockStore = configureStore([]);
