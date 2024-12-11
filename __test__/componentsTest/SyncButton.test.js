import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SyncButton from "../SyncButton"; // Ajusta el path según tu estructura
import { logInfo } from "../../util/logging"; // Mockeamos esta función

jest.mock("../../util/logging", () => ({
  logInfo: jest.fn()
}));

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper"); // Para evitar errores con Animated

describe("SyncButton Component", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<SyncButton />);

    // Verifica que el contenedor del botón exista
    const buttonContainer = getByTestId("sync-button-container");
    expect(buttonContainer).toBeTruthy();

    // Verifica que el ícono esté presente
    const icon = getByTestId("sync-icon");
    expect(icon.props.name).toBe("sync");
    expect(icon.props.size).toBe(28);
    expect(icon.props.color).toBe("#A9A9A9"); // `darkGrey` en formato hexadecimal
  });

  it("should call syncApp when pressed", () => {
    const { getByTestId } = render(<SyncButton />);
    const button = getByTestId("sync-button-pressable");

    // Simula el evento de toque
    fireEvent.press(button);

    // Verifica que logInfo haya sido llamado
    expect(logInfo).toHaveBeenCalledWith("Sync button called");
  });

  it("should trigger animation on press", () => {
    const startAnimationMock = jest.spyOn(
      require("react-native").Animated,
      "timing"
    );

    const { getByTestId } = render(<SyncButton />);
    const button = getByTestId("sync-button-pressable");

    // Simula el toque
    fireEvent.press(button);

    // Verifica que Animated.timing haya sido invocado
    expect(startAnimationMock).toHaveBeenCalled();
  });
});
