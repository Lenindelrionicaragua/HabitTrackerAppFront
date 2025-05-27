import React from "react";
import { render, fireEvent, act, cleanup } from "@testing-library/react-native";
import SyncButton from "../../component/SyncButton/SyncButton";
import { logInfo } from "../../util/logging";
import { Animated, View } from "react-native";

jest.mock("@expo/vector-icons/Ionicons", () => {
  const MockIonicons = ({ name, size, color, testID }) => (
    <View
      testID={testID}
      data-name={name}
      data-size={size}
      data-color={color}
    />
  );
  MockIonicons.displayName = "MockIonicons";
  return MockIonicons;
});

jest.mock("../../util/logging", () => ({
  logInfo: jest.fn()
}));

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper"); // Avoid animation warnings

jest.useFakeTimers();

describe("SyncButton Component", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("renders correctly with icon and text", () => {
    const { getByTestId, getByText } = render(<SyncButton />);

    expect(getByTestId("sync-button-container")).toBeTruthy();
    expect(getByTestId("sync-icon")).toBeTruthy();
    expect(getByText("Synchronize")).toBeTruthy();
  });

  it("calls logInfo when pressed", async () => {
    const { getByTestId } = render(<SyncButton />);
    const button = getByTestId("sync-button-pressable");

    await act(async () => {
      fireEvent.press(button);
    });

    expect(logInfo).toHaveBeenCalledWith("Sync button called");
  });

  it("triggers animation timing on press", () => {
    const timingSpy = jest.spyOn(Animated, "timing");

    const { getByTestId } = render(<SyncButton />);
    const button = getByTestId("sync-button-pressable");

    act(() => {
      fireEvent.press(button);
      jest.advanceTimersByTime(1000);
    });

    expect(timingSpy).toHaveBeenCalled();
  });
});
