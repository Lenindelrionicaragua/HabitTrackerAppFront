// tests/useUpdateCircleColors.test.js
import React from "react";
import { render, act } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { useDispatch, useSelector } from "react-redux";
import {
  setCircleColor,
  setInnerCircleColor
} from "../../actions/counterActions";
import useUpdateCircleColors from "../../hooks/useUpdateCircleColor";

// Mock de acciones
jest.mock("../actions/counterActions", () => ({
  setCircleColor: jest.fn(),
  setInnerCircleColor: jest.fn()
}));

const mockStore = configureStore([]);

describe("useUpdateCircleColors", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      circleColor: "skyblue",
      innerCircleColor: "white"
    });

    store.dispatch = jest.fn();
  });

  it("should update circle and inner circle colors", () => {
    const TestComponent = () => {
      const { circleColor, innerCircleColor, updateColors } =
        useUpdateCircleColors();

      React.useEffect(() => {
        updateColors("green", "yellow");
      }, [updateColors]);

      return (
        <>
          <div>Circle Color: {circleColor}</div>
          <div>Inner Circle Color: {innerCircleColor}</div>
        </>
      );
    };

    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );

    // Check if dispatch was called with correct actions
    expect(store.dispatch).toHaveBeenCalledWith(setCircleColor("green"));
    expect(store.dispatch).toHaveBeenCalledWith(setInnerCircleColor("yellow"));
  });

  it("should correctly select colors from the store", () => {
    const TestComponent = () => {
      const { circleColor, innerCircleColor } = useUpdateCircleColors();

      return (
        <>
          <div>Circle Color: {circleColor}</div>
          <div>Inner Circle Color: {innerCircleColor}</div>
        </>
      );
    };

    const { getByText } = render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );

    // Check if colors are selected correctly from the store
    expect(getByText("Circle Color: skyblue")).toBeInTheDocument();
    expect(getByText("Inner Circle Color: white")).toBeInTheDocument();
  });
});
