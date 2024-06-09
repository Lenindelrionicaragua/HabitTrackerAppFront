import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { CredentialsContext } from "../context/credentialsContext";
import RootStack from "../navigators/RootStack";

// Mock the environment variables
jest.mock("@env", () => ({
  EXPO_CLIENT_ID: "mock_expo_client_id",
  IOS_CLIENT_ID: "mock_ios_client_id",
  ANDROID_CLIENT_ID: "mock_android_client_id",
  WEB_CLIENT_ID: "mock_web_client_id"
}));

// Mock Google auth request
jest.mock("expo-auth-session/providers/google", () => {
  return {
    useAuthRequest: () => [
      jest.fn(), // request
      { type: "success" }, // response
      jest.fn() // promptAsync
    ]
  };
});

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
      navigate: mockNavigate
    })
  };
});

// Mock of the credentials context
const mockCredentialsContextWithCredentials = {
  storedCredentials: { user: "testUser", token: "testToken" }
};

const mockCredentialsContextWithoutCredentials = {
  storedCredentials: null
};

describe("App", () => {
  test("Render WelcomeScreen if there are stored credentials", async () => {
    const { getByTestId } = render(
      <CredentialsContext.Provider
        value={mockCredentialsContextWithCredentials}
      >
        <RootStack />
      </CredentialsContext.Provider>
    );

    // Wait for the WelcomeScreen to be rendered
    await waitFor(() => {
      const welcomeScreen = getByTestId("welcome-container");
      expect(welcomeScreen).toBeTruthy();
    });
  });

  test("Render LoginScreen if there are no stored credentials", async () => {
    const { getByTestId } = render(
      <CredentialsContext.Provider
        value={mockCredentialsContextWithoutCredentials}
      >
        <RootStack />
      </CredentialsContext.Provider>
    );

    // Wait for the LoginScreen to be rendered
    await waitFor(() => {
      const loginScreen = getByTestId("login-styled-container");
      expect(loginScreen).toBeTruthy();
    });
  });
});
