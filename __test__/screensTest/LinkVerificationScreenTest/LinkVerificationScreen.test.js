// __tests__/components/LinkVerification/LinkVerificationScreen.test.js
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as Linking from "react-native/Libraries/Linking/Linking";
import LinkVerificationScreen from "../../../screens/LinkVerificationScreen/LinkVerificationScreen";
import useFetch from "../../../hooks/api/useFetch";
import { CredentialsContext } from "../../../context/credentialsContext";

jest.mock("../../../hooks/api/useFetch");

describe("LinkVerificationScreen", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(React, "useContext").mockReturnValue({
      storedCredentials: { email: "test@example.com", _id: "user-id" }
    });
    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(mockDispatch);
  });

  it("renders title and email", () => {
    jest.spyOn(Linking, "getInitialURL").mockResolvedValue(null);

    useFetch.mockReturnValue({ performFetch: jest.fn(), isLoading: false });

    const { getByText } = render(
      <CredentialsContext.Provider
        value={{ storedCredentials: { email: "test@example.com" } }}>
        <LinkVerificationScreen navigation={{ navigate: mockNavigate }} />
      </CredentialsContext.Provider>
    );

    expect(getByText("Account Verification")).toBeTruthy();
    expect(getByText("test@example.com")).toBeTruthy();
  });

  it("handles deep link token and calls verifyPerformFetch when Proceed pressed", async () => {
    jest
      .spyOn(Linking, "getInitialURL")
      .mockResolvedValue("myapp://verify?token=abc123");
    const mockPerformFetch = jest.fn();
    useFetch.mockReturnValue({
      performFetch: mockPerformFetch,
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
      expect(mockPerformFetch).toHaveBeenCalledWith({
        method: "POST",
        data: { token: "abc123" }
      });
    });
  });

  it("calls resendPerformFetch when Resend button pressed", async () => {
    jest.spyOn(Linking, "getInitialURL").mockResolvedValue(null);
    const mockVerifyFetch = jest.fn(),
      mockResendFetch = jest.fn();

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
