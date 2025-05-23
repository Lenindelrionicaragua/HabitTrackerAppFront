import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { act } from "react-test-renderer";
import LinkVerificationScreen from "../../../screens/LinkVerificationScreen/LinkVerificationScreen";
import { CredentialsContext } from "../../../context/credentialsContext";
import useFetch from "../../../hooks/api/useFetch";

// Mock del hook useFetch
jest.mock("../../../hooks/api/useFetch");

describe("LinkVerificationScreen", () => {
  const mockPerformFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useFetch.mockReturnValue({
      performFetch: mockPerformFetch,
      isLoading: false
    });
  });

  const storedCredentialsMock = {
    email: "test@example.com",
    token: "abc123token"
  };

  it("renders and shows email from context", () => {
    const { getByText } = render(
      <CredentialsContext.Provider
        value={{ storedCredentials: storedCredentialsMock }}>
        <LinkVerificationScreen />
      </CredentialsContext.Provider>
    );

    expect(getByText("We've sent a verification email to:")).toBeTruthy();
    expect(getByText(storedCredentialsMock.email)).toBeTruthy();
  });

  it("calls resendEmail and updates status on success", async () => {
    jest.useFakeTimers();

    const localMockPerformFetch = jest.fn(() =>
      Promise.resolve({ success: true, msg: "Sent!" })
    );

    useFetch.mockReturnValue({
      performFetch: localMockPerformFetch,
      isLoading: false
    });

    const { getByText } = render(
      <CredentialsContext.Provider
        value={{ storedCredentials: storedCredentialsMock }}>
        <LinkVerificationScreen />
      </CredentialsContext.Provider>
    );

    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(getByText(/resend/i)).toBeTruthy();
    });

    const resendButton = getByText(/resend/i);

    await act(async () => {
      fireEvent.press(resendButton);
    });

    await waitFor(() => {
      expect(localMockPerformFetch).toHaveBeenCalledWith({
        method: "POST",
        data: {
          email: storedCredentialsMock.email,
          token: storedCredentialsMock.token
        }
      });
    });

    jest.useRealTimers();
  });
});
