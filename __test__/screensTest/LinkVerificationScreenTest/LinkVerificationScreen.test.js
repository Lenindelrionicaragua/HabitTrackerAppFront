import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import LinkVerificationScreen from "../../../screens/LinkVerificationScreen/LinkVerificationScreen";
import useFetch from "../../../hooks/api/useFetch";
import { CredentialsContext } from "../../../context/credentialsContext";

jest.mock("../../../hooks/api/useFetch");

const mockSubscription = { remove: jest.fn() };
jest
  .spyOn(ReactNative.Linking, "addEventListener")
  .mockReturnValue(mockSubscription);
jest.spyOn(ReactNative.Linking, "getInitialURL");

describe("LinkVerificationScreen", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const defaultText = "We will send you an email to verify your account.";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(React, "useContext").mockReturnValue({
      storedCredentials: { email: "test@example.com", _id: "user-id" }
    });
    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(mockDispatch);
  });

  it("renders title and default instruction", () => {
    ReactNative.Linking.getInitialURL.mockResolvedValue(null);
    useFetch.mockReturnValue({ performFetch: jest.fn(), isLoading: false });

    const { getByText, queryByText } = render(
      <CredentialsContext.Provider
        value={{ storedCredentials: { email: "test@example.com" } }}>
        <LinkVerificationScreen navigation={{ navigate: mockNavigate }} />
      </CredentialsContext.Provider>
    );

    expect(getByText("Account Verification")).toBeTruthy();
    expect(getByText(defaultText)).toBeTruthy();
    expect(queryByText("test@example.com")).toBeNull();
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

    fireEvent.press(getByText("Proceed"));

    await waitFor(() => {
      expect(mockVerifyFetch).toHaveBeenCalledWith({
        method: "POST",
        data: { token: "abc123" }
      });
    });
  });

  it("calls resendPerformFetch when Resend button pressed", () => {
    ReactNative.Linking.getInitialURL.mockResolvedValue(null);
    const mockVerifyFetch = jest.fn();
    const mockResendFetch = jest.fn();

    useFetch
      .mockReturnValueOnce({ performFetch: mockVerifyFetch, isLoading: false })
      .mockReturnValueOnce({ performFetch: mockResendFetch, isLoading: false });

    const { getByText } = render(
      <CredentialsContext.Provider
        value={{
          storedCredentials: { email: "test@example.com", _id: "user-id" }
        }}>
        <LinkVerificationScreen navigation={{ navigate: mockNavigate }} />
      </CredentialsContext.Provider>
    );

    fireEvent.press(getByText("Resend"));

    expect(mockResendFetch).toHaveBeenCalledWith({
      method: "POST",
      data: { email: "test@example.com", userId: "user-id" }
    });
  });
});
