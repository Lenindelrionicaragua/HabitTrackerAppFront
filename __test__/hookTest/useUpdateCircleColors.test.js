import React from "react";
import configureStore from "redux-mock-store";
import {
  setCircleColor,
  setInnerCircleColor
} from "../../actions/counterActions";
import useUpdateCircleColors from "../../hooks/useUpdateCircleColor";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";

const mockStore = configureStore([]);

describe("useUpdateCircleColors hook", () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      circleColor: "skyBlue",
      innerCircleColor: "white"
    };
    store = mockStore(initialState);
  });

  it("should dispatch actions to update circle colors in the store", () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useUpdateCircleColors(), { wrapper });

    const newCircleColor = "green";
    const newInnerCircleColor = "black";

    act(() => {
      result.current.updateColors(newCircleColor, newInnerCircleColor);
    });

    const actions = store.getActions();
    expect(actions).toEqual([
      setCircleColor(newCircleColor),
      setInnerCircleColor(newInnerCircleColor)
    ]);
  });
});