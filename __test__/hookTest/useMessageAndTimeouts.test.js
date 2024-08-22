import React from "react";
import configureStore from "redux-mock-store";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import useMessageAndTimeouts from "../../hooks/useMessageAndTimeouts";
import { setInfoText, setResetTimeoutsIds } from "../../actions/counterActions";
import { clearMessagesAndTimeouts } from "../../util/messageAndTimeoutHandlers";

const mockStore = configureStore([]);

describe("useMessageAndTimeouts hook", () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      resetTimeoutsIds: [1, 2, 3]
    };
    store = mockStore(initialState);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore real timers after the test
  });

  // it("should dispatch actions to clear all messages and timeouts", () => {
  //   const wrapper = ({ children }) => (
  //     <Provider store={store}>{children}</Provider>
  //   );

  //   const { result } = renderHook(() => useMessageAndTimeouts(), { wrapper });

  //   // Call the function to clear all messages and timeouts
  //   act(() => {
  //     result.current.clearAllMessagesAndTimeouts();
  //   });

  //   // Verify that the correct actions are dispatched
  //   const actions = store.getActions();
  //   expect(actions).toContainEqual(setResetTimeoutsIds([])); // Expect an empty array
  //   expect(actions).toContainEqual(setInfoText(""));
  // });

  // it("should dispatch actions to clear all messages and timeouts", () => {
  //   const wrapper = ({ children }) => (
  //     <Provider store={store}>{children}</Provider>
  //   );

  //   const { result } = renderHook(() => useMessageAndTimeouts(), { wrapper });

  //   // Call the function to clear all messages and timeouts
  //   act(() => {
  //     result.current.clearAllMessagesAndTimeouts();
  //   });

  //   // Verify that the correct actions are dispatched
  //   const actions = store.getActions();
  //   expect(actions).toContainEqual({
  //     type: "SET_RESET_TIMEOUTS_IDS",
  //     payload: []
  //   });
  //   expect(actions).toContainEqual({
  //     type: "SET_INFO_TEXT",
  //     payload: ""
  //   });
  // });

  it("should correctly set initial resetTimeoutsIds state", () => {
    const delay = 5000;
    const setInfoText = jest.fn();
    const setTimeoutIds = jest.fn();
    const timeoutIds = [1, 2, 3];

    const mockSetTimeout = jest.spyOn(global, "setTimeout");

    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useMessageAndTimeouts(), { wrapper });

    // expect(result.current.resetTimeoutsIds).toEqual([1, 2, 3]);

    // Llamar a la función que queremos probar
    act(() => {
      result.current.scheduleInfoTextClearInStore(delay);
    });

    // Simular el paso del tiempo
    jest.advanceTimersByTime(delay);

    // Verificar que las acciones esperadas se han despachado
    const actions = store.getActions();
    expect(actions).toContainEqual(setInfoText(""));
    expect(actions).toContainEqual(setResetTimeoutsIds([]));

    // Restaurar el espía de `setTimeout`
    mockSetTimeout.mockRestore();
  });
});
