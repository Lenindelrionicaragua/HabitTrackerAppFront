import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
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

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper"); // Avoid mistakes with Animated

jest.useFakeTimers(); // To control the timing of animations

describe("SyncButton Component", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<SyncButton />);

    const buttonContainer = getByTestId("sync-button-container");
    expect(buttonContainer).toBeTruthy();

    // Ensure the Sync Button container and icon are rendered
    const icon = buttonContainer.find(
      node => node.type === "div" && node.props["data-testid"] === "sync-icon"
    );
    expect(icon).toBeTruthy();
    expect(icon.props["data-name"]).toBe("sync");
    expect(icon.props["data-size"]).toBe(28);
    expect(icon.props["data-color"]).toBe("#2c2c2c"); // darkGrey

    // Test that the text "Synchronize" is rendered correctly
    const buttonText = getByTestId("sync-button-container").find(
      node => node.type === "Text" && node.props.children === "Synchronize"
    );
    expect(buttonText).toBeTruthy();
  });

  it("should call syncApp when pressed", async () => {
    const { getByTestId } = render(<SyncButton />);
    const button = getByTestId("sync-button-pressable");

    await act(async () => {
      fireEvent.press(button);
    });

    expect(logInfo).toHaveBeenCalledWith("Sync button called");
  });

  it("should trigger animation on press", () => {
    const startAnimationMock = jest.spyOn(
      require("react-native").Animated,
      "timing"
    );

    const { getByTestId } = render(<SyncButton />);
    const button = getByTestId("sync-button-pressable");

    act(() => {
      fireEvent.press(button);
      jest.advanceTimersByTime(1000);
    });

    expect(startAnimationMock).toHaveBeenCalled();
  });

  it("should contain the Animated.View element", () => {
    const { getByTestId } = render(<SyncButton />);
    const animatedView = getByTestId("sync-button-pressable").find(
      node => node.type === "div" && node.props["data-testid"] === "sync-icon"
    );

    expect(animatedView).toBeTruthy();
  });

  it("should render the text 'Synchronize'", () => {
    const { getByText } = render(<SyncButton />);
    const syncText = getByText("Synchronize");
    expect(syncText).toBeTruthy();
  });
});
