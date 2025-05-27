import React from "react";
import { render, fireEvent, act, cleanup } from "@testing-library/react-native";
import SyncButton from "../../component/SyncButton/SyncButton";
import { logInfo } from "../../util/logging";

jest.mock("@expo/vector-icons/Ionicons", () => {
  const MockIonicons = ({ name, size, color, testID }) => (
    <div
      data-testid={testID}
      data-name={name}
      data-size={size}
      data-color={color}
    />
  );
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

  test("renders button with icon and text", () => {
    const { getByTestId, getByText } = render(<SyncButton />);

    expect(getByTestId("sync-button-container")).toBeTruthy();
    expect(getByTestId("sync-icon")).toBeTruthy();
    expect(getByText("Synchronize")).toBeTruthy();

    const icon = getByTestId("sync-icon");
    expect(icon.props["data-name"]).toBe("sync");
    expect(icon.props["data-size"]).toBe(28);
    expect(icon.props["data-color"]).toBe("#2c2c2c"); // darkGrey
  });

  test("calls logInfo when pressed", async () => {
    const { getByTestId } = render(<SyncButton />);
    const button = getByTestId("sync-button-pressable");

    await act(async () => {
      fireEvent.press(button);
    });

    expect(logInfo).toHaveBeenCalledWith("Sync button called");
  });

  test("triggers animation on press", () => {
    const timingSpy = jest.spyOn(require("react-native").Animated, "timing");

    const { getByTestId } = render(<SyncButton />);
    const button = getByTestId("sync-button-pressable");

    act(() => {
      fireEvent.press(button);
      jest.advanceTimersByTime(1000);
    });

    expect(timingSpy).toHaveBeenCalled();
  });

  test("renders Animated view element", () => {
    const { getByTestId } = render(<SyncButton />);
    expect(getByTestId("sync-icon")).toBeTruthy();
  });
});
