import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import LinkVerificationScreen from "../../../screens/LinkVerificationScreen/LinkVerificationScreen";
import useFetch from "../../../hooks/api/useFetch";
import { CredentialsContext } from "../../../context/credentialsContext";

jest.mock("../../../hooks/api/useFetch");
jest.spyOn(ReactNative.Linking, "getInitialURL").mockResolvedValue(null);

const mockNavigate = jest.fn();
const mockAddListener = jest.fn(() => ({ remove: jest.fn() }));
const mockNavigation = {
  navigate: mockNavigate,
  addListener: mockAddListener
};

const mockDispatch = jest.fn();
const defaultText = "We will send you an email to verify your account.";

describe("LinkVerificationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(React, "useContext").mockReturnValue({
      storedCredentials: { email: "test@example.com", _id: "user-id" }
    });

    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(mockDispatch);

    ReactNative.Linking.getInitialURL.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders title and default instruction", () => {
    useFetch.mockReturnValue({ performFetch: jest.fn(), isLoading: false });

    const { getByText, queryByText } = render(
      <CredentialsContext.Provider
        value={{ storedCredentials: { email: "test@example.com" } }}>
        <LinkVerificationScreen navigation={mockNavigation} />
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
        <LinkVerificationScreen navigation={mockNavigation} />
      </CredentialsContext.Provider>
    );

    await waitFor(() => expect(mockVerifyFetch).not.toHaveBeenCalled());

    act(() => {
      fireEvent.press(getByText("Proceed"));
    });

    await waitFor(() => {
      expect(mockVerifyFetch).toHaveBeenCalledWith({
        method: "POST",
        data: { token: "abc123" }
      });
    });
  });

  it("resend link triggers API call and shows Failed status", async () => {
    jest.useFakeTimers();

    ReactNative.Linking.getInitialURL.mockResolvedValue(
      "myapp://verify?token=abc123"
    );

    const mockResendFetch = jest.fn(() => Promise.resolve({ success: false }));

    useFetch.mockReturnValue({
      performFetch: mockResendFetch,
      isLoading: false
    });

    const { getByTestId, getByText } = render(
      <CredentialsContext.Provider
        value={{
          storedCredentials: { email: "test@example.com", _id: "user-id" }
        }}>
        <LinkVerificationScreen navigation={mockNavigation} />
      </CredentialsContext.Provider>
    );

    act(() => {
      jest.advanceTimersByTime(45000);
    });

    await waitFor(() => {
      expect(getByTestId("resend-button")).toBeTruthy();
    });

    const resendButton = getByTestId("resend-button");

    await act(async () => {
      fireEvent.press(resendButton);
    });

    await waitFor(() => {
      expect(mockResendFetch).toHaveBeenCalledWith({
        method: "POST",
        data: { token: "abc123" }
      });
    });

    expect(getByText("Failed")).toBeTruthy();

    act(() => {
      jest.runAllTimers();
    });

    jest.useRealTimers();
  });
});
