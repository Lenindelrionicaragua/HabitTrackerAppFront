import React from "react";
import { render, cleanup } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import * as Google from "expo-auth-session/providers/google";

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

// Rendering Functions
const renderLoginScreen = () => render(<LoginScreen />);
const renderLoginScreenWithRenderer = () => renderer.create(<LoginScreen />);

let loginScreenRender;
let loginScreenRenderWithRenderer;

beforeEach(() => {
  loginScreenRender = renderLoginScreen();
  loginScreenRenderWithRenderer = renderLoginScreenWithRenderer();
});

//LoginScreen
describe("LoginScreen", () => {
  afterEach(() => {
    cleanup();
  });

  test("Renders correctly the LoginScreen Component", () => {
    const loginScreenSnapshot = loginScreenRenderWithRenderer.toJSON();
    expect(loginScreenSnapshot).toMatchSnapshot();
  });
});
