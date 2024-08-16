import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react-native";
import StopwatchScreen from "../../screens/StopwatchScreen/StopwatchScreen";

describe("StopwatchScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Should start the timer by pressing the start button", () => {
    render(<StopwatchScreen />);

    expect(screen.getByTestId("svg-time-text")).toBeTruthy();

    fireEvent.press(screen.getByTestId("start-button"));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText("00:00:01")).toBeTruthy();
  });
});
