import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import useUpdateCircleColors from "../../hooks/useUpdateCircleColors";
import {
  setCircleColor,
  setInnerCircleColor
} from "../../actions/counterActions";

const mockStore = configureStore([]);

describe("useUpdateCircleColors hook", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      circleColor: "black",
      innerCircleColor: "white"
    });

    store.dispatch = jest.fn();
  });

  afterEach(() => {
    store.dispatch.mockClear();
  });

  it("should update circleColor and innerCircleColor correctly", () => {
    const { result } = renderHook(() => useUpdateCircleColors(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    act(() => {
      result.current.updateColors("red", "blue");
    });

    expect(store.dispatch).toHaveBeenCalledWith(setCircleColor("red"));
    expect(store.dispatch).toHaveBeenCalledWith(setInnerCircleColor("blue"));
  });

  // it("should throw an error for invalid colors", () => {
  //   const { result } = renderHook(() => useUpdateCircleColors(), {
  //     wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
  //   });

  //   expect(() => {
  //     act(() => {
  //       result.current.updateColors("", "blue");
  //     });
  //   }).toThrow("Invalid value for circleColor: ");

  //   expect(() => {
  //     act(() => {
  //       result.current.updateColors("red", "");
  //     });
  //   }).toThrow("Invalid value for innerCircleColor: ");
  // });
});
