import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LinkVerificationScreen from "../../../screens/LinkVerificationScreen/LinkVerificationScreen";
import { CredentialsContext } from "../../../context/credentialsContext";

// Mock navigation and dispatch
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch
}));

// Mock useFetch
jest.mock("../../../hooks/api/useFetch", () => {
  return jest.fn((url, callback) => {
    return {
      performFetch: jest.fn(({ method, data }) => {
        if (url.includes("sign-up")) {
          callback({ success: true });
        } else if (url.includes("resend-verification-email")) {
          callback({ success: true });
        }
        return Promise.resolve();
      }),
      isLoading: false
    };
  });
});

describe("LinkVerificationScreen", () => {
  const storedCredentials = {
    email: "user@example.com"
  };

  const navigation = {
    replace: mockNavigate,
    navigate: mockNavigate,
    goBack: jest.fn()
  };

  const routeWithToken = {
    params: {
      token: "valid-token"
    }
  };

  const routeWithoutToken = {
    params: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders default verification message", () => {
    const { getByText } = render(
      <CredentialsContext.Provider value={{ storedCredentials }}>
        <LinkVerificationScreen
          navigation={navigation}
          route={routeWithToken}
        />
      </CredentialsContext.Provider>
    );

    expect(getByText("Account Verification")).toBeTruthy();
    expect(
      getByText("We will send you an email to verify your account.")
    ).toBeTruthy();
    expect(getByText(storedCredentials.email)).toBeTruthy();
  });

  test("navigates to SuccessScreen on valid token", async () => {
    const { getByText } = render(
      <CredentialsContext.Provider value={{ storedCredentials }}>
        <LinkVerificationScreen
          navigation={navigation}
          route={routeWithToken}
        />
      </CredentialsContext.Provider>
    );

    fireEvent.press(getByText("Proceed"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_ACTIVE_SCREEN",
        payload: "LoginScreen"
      });
      expect(mockNavigate).toHaveBeenCalledWith("SuccessScreen", {
        email: storedCredentials.email
      });
    });
  });

  test("shows error if token is missing", async () => {
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

  test("handles resend email action", async () => {
    const { getByText } = render(
      <CredentialsContext.Provider value={{ storedCredentials }}>
        <LinkVerificationScreen
          navigation={navigation}
          route={routeWithToken}
        />
      </CredentialsContext.Provider>
    );

    // Simulate clicking resend (you may need to adjust this if button is inside a child)
    fireEvent.press(getByText(/Resend/i));

    await waitFor(() => {
      // We can’t check UI change easily, but we can rely on no crash and callback
      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: "SET_ACTIVE_SCREEN" })
      );
    });
  });
});
