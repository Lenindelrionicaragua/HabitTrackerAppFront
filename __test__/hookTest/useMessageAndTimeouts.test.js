import { renderHook, act } from "@testing-library/react-hooks";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import useMessageAndTimeouts from "../../hooks/useMessageAndTimeouts";
import { setInfoText, setResetTimeoutsIds } from "../../actions/counterActions";
import {
  clearMessagesAndTimeouts,
  scheduleInfoTextClear
} from "../../util/messageAndTimeoutHandlers";

const mockStore = configureStore();

describe("useMessageAndTimeouts hook", () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      resetTimeoutsIds: [1, 2, 3]
    };
    store = mockStore(initialState);

    // Mock the clearMessagesAndTimeouts and scheduleInfoTextClear functions
    jest
      .spyOn(messageAndTimeoutHandlers, "clearMessagesAndTimeouts")
      .mockImplementation((ids, setTimeoutIds, setInfoText) => {
        setTimeoutIds([]);
        setInfoText("");
      });
    jest
      .spyOn(messageAndTimeoutHandlers, "scheduleInfoTextClear")
      .mockImplementation((delay, setInfoText, setTimeoutIds, ids) => {
        setTimeoutIds([...ids, 123]);
        setInfoText("");
      });
  });

  it("should dispatch actions to clear messages and timeouts and set info text with timeout", () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useMessageAndTimeouts(), { wrapper });

    act(() => {
      result.current.clearAllMessagesAndTimeouts();
    });

    const actionsAfterClear = store.getActions();
    expect(actionsAfterClear).toEqual([
      setResetTimeoutsIds([]),
      setInfoText("")
    ]);

    act(() => {
      result.current.setInfoTextWithTimeout();
    });

    const actionsAfterTimeout = store.getActions();
    expect(actionsAfterTimeout).toEqual([
      setResetTimeoutsIds([]),
      setInfoText(""),
      setResetTimeoutsIds([123])
    ]);
  });
});
