import React from "react";
import configureStore from "redux-mock-store";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import useMessageAndTimeouts from "../../hooks/useMessageAndTimeouts";
import { setInfoText, setResetTimeoutsIds } from "../../actions/counterActions";

const mockStore = configureStore([]);

describe("useMessageAndTimeouts hook", () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      resetTimeoutsIds: [1, 2, 3] // Define initial state
    };
    store = mockStore(initialState);
  });

  it("should dispatch actions to clear all messages and timeouts", () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useMessageAndTimeouts(), { wrapper });

    // Call the function to clear all messages and timeouts
    act(() => {
      result.current.clearAllMessagesAndTimeouts();
    });

    // Verify that the correct actions are dispatched
    const actions = store.getActions();
    expect(actions).toContainEqual(setResetTimeoutsIds([])); // Expect an empty array
    expect(actions).toContainEqual(setInfoText(""));
  });

  it("should dispatch actions to schedule info text clear in the store", () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useMessageAndTimeouts(), { wrapper });

    const mockSetTimeout = jest.spyOn(global, "setTimeout");
    const timeoutIds = [1, 2, 3];

    // Mock functions
    const mockSetInfoText = jest.fn();
    const mockSetResetTimeoutsIds = jest.fn();

    // Mock implementation of scheduleInfoTextClear
    jest.mock("../../util/messageAndTimeoutHandlers", () => ({
      scheduleInfoTextClear: (setInfoText, setTimeoutIds, timeoutIds) => {
        const timeoutId = 123; // Simulate a timeout ID
        mockSetTimeout.mockImplementation((fn, delay) => {
          setTimeoutIds(prevIds => [...prevIds, timeoutId]);
          fn(); // Execute the callback immediately for testing
          return timeoutId;
        });
        setInfoText(""); // Call the setInfoText mock
      }
    }));

    // Call the function to schedule info text clear
    act(() => {
      result.current.scheduleInfoTextClearInStore();
    });

    // Verify that the correct actions are dispatched
    const actions = store.getActions();
    expect(actions).toContainEqual(setInfoText(""));
    expect(actions).toContainEqual(
      setResetTimeoutsIds(expect.arrayContaining([123]))
    ); // Expect array containing timeout ID

    // Verify that setTimeout was called
    expect(mockSetTimeout).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Number)
    );

    mockSetTimeout.mockRestore();
  });
});
