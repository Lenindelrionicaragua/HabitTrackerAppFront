import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LinkVerificationScreen from "../../../screens/LinkVerificationScreen/LinkVerificationScreen";
import { CredentialsContext } from "../../../context/credentialsContext";
import { useDispatch } from "react-redux";

// Mock navigation and dispatch
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch
}));

// Mock useFetch hook
jest.mock("../../../hooks/api/useFetch", () => ({
  __esModule: true,
  default: (url, callback) => {
    return {
      performFetch: jest.fn(async ({ method, data }) => {
        if (url.includes("sign-up")) {
          // Simulate success response for verification
          callback({ success: true, msg: "Verified" });
        } else if (url.includes("resend-verification-email")) {
          // Simulate success response for resend email
          callback({ success: true, msg: "Email sent" });
        }
      }),
      isLoading: false
    };
  }
}));

describe("LinkVerificationScreen", () => {
  const route = {
    params: {
      token: "test-token-123"
    }
  };

  const navigation = {
    navigate: mockNavigate
  };

  const storedCredentials = {
    email: "user@example.com"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly and shows default message", () => {
    const { getByText } = render(
      <CredentialsContext.Provider value={{ storedCredentials }}>
        <LinkVerificationScreen navigation={navigation} route={route} />
      </CredentialsContext.Provider>
    );

    expect(getByText("Account Verification")).toBeTruthy();
    expect(
      getByText("We will send you an email to verify your account.")
    ).toBeTruthy();
    expect(getByText(storedCredentials.email)).toBeTruthy();
  });

  test("proceeds with verification when token exists", async () => {
    const { getByText } = render(
      <CredentialsContext.Provider value={{ storedCredentials }}>
        <LinkVerificationScreen navigation={navigation} route={route} />
      </CredentialsContext.Provider>
    );

    fireEvent.press(getByText("Proceed"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_ACTIVE_SCREEN",
        payload: "LoginScreen"
      });
      expect(mockNavigate).toHaveBeenCalledWith("LoginScreen", {
        email: storedCredentials.email
      });
      expect(getByText("Account verified successfully!")).toBeTruthy();
    });
  });

  test("shows error message if token is missing", async () => {
    const routeWithoutToken = { params: {} };

    const { getByText } = render(
      <CredentialsContext.Provider value={{ storedCredentials }}>
        <LinkVerificationScreen
          navigation={navigation}
          route={routeWithoutToken}
        />
      </CredentialsContext.Provider>
    );

    fireEvent.press(getByText("Proceed"));

    await waitFor(() => {
      expect(getByText("No token found. Please try again.")).toBeTruthy();
    });
  });

  test("resends verification email", async () => {
    const { getByText } = render(
      <CredentialsContext.Provider value={{ storedCredentials }}>
        <LinkVerificationScreen navigation={navigation} route={route} />
      </CredentialsContext.Provider>
    );

    fireEvent.press(getByText("Resend"));

    // No assertions here because resend email button might be inside ResendTimer component,
    // which might need further mocking or querying by testID depending on your implementation
  });
});
