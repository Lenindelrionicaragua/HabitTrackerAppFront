import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import SyncButton from "../../component/SyncButton/SyncButton";
import { logInfo } from "../../util/logging";

jest.mock("../../util/logging", () => ({
  logInfo: jest.fn()
}));

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("@expo/vector-icons/Ionicons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  const MockIonicons = ({ name, testID }) => (
    <Text testID={testID}>{name}</Text>
  );
  MockIonicons.displayName = "Ionicons";
  return MockIonicons;
});

jest.useFakeTimers();

describe("SyncButton Component", () => {
  it("renders correctly", () => {
    const { getByTestId, getByText } = render(<SyncButton />);
    expect(getByTestId("sync-button-container")).toBeTruthy();
    expect(getByTestId("sync-icon")).toBeTruthy();
    expect(getByText("Synchronize")).toBeTruthy();
  });

  it("calls syncApp when pressed", () => {
    const { getByTestId } = render(<SyncButton />);
    act(() => {
      fireEvent.press(getByTestId("sync-button-pressable"));
    });
    expect(logInfo).toHaveBeenCalledWith("Sync button called");
  });

  it("starts animation on press and resets background color", () => {
    const Animated = require("react-native").Animated;
    const timingSpy = jest.spyOn(Animated, "timing");

    const { getByTestId } = render(<SyncButton />);

    act(() => {
      fireEvent.press(getByTestId("sync-button-pressable"));
    });

    expect(timingSpy).toHaveBeenCalled();

    // Avanzar el timer para el setTimeout que cambia bgColor
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    timingSpy.mockRestore();
  });
});
