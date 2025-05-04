import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import LinkVerificationScreen from "../../../screens/LinkVerificationScreen/LinkVerificationScreen";
import useFetch from "../../../hooks/api/useFetch";
import { CredentialsContext } from "../../../context/credentialsContext";

// Mocks globales
jest.mock("../../../hooks/api/useFetch");
jest.spyOn(ReactNative.Linking, "getInitialURL").mockResolvedValue(null);

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const defaultText = "We will send you an email to verify your account.";

describe("LinkVerificationScreen", () => {
  beforeEach(() => {
    // Limpieza de mocks antes de cada test
    jest.clearAllMocks();

    // Mock de contextos
    jest.spyOn(React, "useContext").mockReturnValue({
      storedCredentials: { email: "test@example.com", _id: "user-id" }
    });

    // Mock de Redux dispatch
    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(mockDispatch);

    // Mock global de Linking
    ReactNative.Linking.getInitialURL.mockResolvedValue(null);
  });

  afterEach(() => {
    // Restaurar cualquier estado global o configuraciones
    jest.useRealTimers();
  });

  it("renders title and default instruction", () => {
    useFetch.mockReturnValue({ performFetch: jest.fn(), isLoading: false });

    const { getByText, queryByText } = render(
      <CredentialsContext.Provider
        value={{ storedCredentials: { email: "test@example.com" } }}>
        <LinkVerificationScreen navigation={{ navigate: mockNavigate }} />
      </CredentialsContext.Provider>
    );

    expect(getByText("Account Verification")).toBeTruthy();
    expect(getByText(defaultText)).toBeTruthy();
    expect(queryByText("test@example.com")).toBeTruthy();
  });

  it("handles deep link token and calls verifyPerformFetch when Proceed pressed", async () => {
    ReactNative.Linking.getInitialURL.mockResolvedValue(
      "myapp://verify?token=abc123"
    );
    const mockVerifyFetch = jest.fn();
    useFetch.mockReturnValue({
      performFetch: mockVerifyFetch,
      isLoading: false
    });

    const { getByText } = render(
      <CredentialsContext.Provider
        value={{ storedCredentials: { email: "test@example.com" } }}>
        <LinkVerificationScreen navigation={{ navigate: mockNavigate }} />
      </CredentialsContext.Provider>
    );

    await waitFor(() => expect(mockVerifyFetch).not.toHaveBeenCalled());

    fireEvent.press(getByText("Proceed"));

    await waitFor(() => {
      expect(mockVerifyFetch).toHaveBeenCalledWith({
        method: "POST",
        data: { token: "abc123" }
      });
    });
  });

  it("calls resendPerformFetch when Resend button pressed", async () => {
    jest.useFakeTimers();

    const mockVerifyFetch = jest.fn();
    const mockResendFetch = jest.fn();

    useFetch
      .mockImplementationOnce(() => ({
        performFetch: mockVerifyFetch,
        isLoading: false
      }))
      .mockImplementationOnce(() => ({
        performFetch: mockResendFetch,
        isLoading: false
      }));

    const { getByText } = render(
      <CredentialsContext.Provider
        value={{
          storedCredentials: { email: "test@example.com", _id: "user-id" }
        }}>
        <LinkVerificationScreen navigation={{ navigate: jest.fn() }} />
      </CredentialsContext.Provider>
    );

    // Avanza el tiempo para activar el botón
    act(() => {
      jest.advanceTimersByTime(31000);
    });

    const resendButton = await waitFor(() => getByText("Resend"));
    expect(resendButton).toBeTruthy();

    fireEvent.press(resendButton);

    expect(mockResendFetch).toHaveBeenCalledWith({
      method: "POST",
      data: { email: "test@example.com", userId: "user-id" }
    });

    jest.useRealTimers();
  });
});
