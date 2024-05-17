import React from "react";
import renderer from "react-test-renderer";
import { render, cleanup, fireEvent, act } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import WelcomeScreen from "../../screens/WelcomeScreen/WelcomeScreen";

import { StatusBar } from "react-native";

// Rendering Functions
const renderWelcomeScreen = routeParams =>
  render(<WelcomeScreen route={{ params: routeParams }} />);
const renderWelcomeScreenWithRenderer = routeParams =>
  renderer.create(<WelcomeScreen route={{ params: routeParams }} />);

let welcomeScreenRender;
let welcomeScreenRenderWithRenderer;

beforeEach(() => {
  welcomeScreenRender = renderWelcomeScreen({
    name: "Zen User",
    email: "serenity@gmail.com"
  });
  welcomeScreenRenderWithRenderer = renderWelcomeScreenWithRenderer({
    name: "Zen User",
    email: "serenity@gmail.com"
  });
});

//SignupScreen
describe("WelcomeScreen", () => {
  afterEach(() => {
    cleanup();
  });

  test("Renders correctly the WelcomeScreen Component", () => {
    const WelcomeScreenSnapshot = welcomeScreenRenderWithRenderer.toJSON();
    expect(WelcomeScreenSnapshot).toMatchSnapshot();
  });

  test("Render StatusBar correctly", () => {
    const WelcomeScreenInstance = welcomeScreenRenderWithRenderer.root;
    const statusBar = WelcomeScreenInstance.findByType(StatusBar);
    expect(statusBar).toBeTruthy();
  });

  test("Render UI components correctly", () => {
    const { getByTestId } = welcomeScreenRender;
    expect(getByTestId("inner-container")).toBeTruthy();
    expect(getByTestId("welcome-container")).toBeTruthy();
    expect(getByTestId("welcome-title")).toBeTruthy();
    expect(getByTestId("user-name")).toBeTruthy();
    expect(getByTestId("user-email")).toBeTruthy();
  });

  test("PageTitle should render a string of letters, numbers, or spaces", () => {
    const { getByTestId } = welcomeScreenRender;
    const pageTitleComponent = getByTestId("welcome-title");
    const textContent = pageTitleComponent.props.children.toString();
    expect(textContent).toMatch("Welcome!");
  });

  test("SubTitle should render a string of letters, numbers or spaces", () => {
    const { getByTestId } = welcomeScreenRender;
    const subTitleComponent = getByTestId("user-name");
    const textContent = subTitleComponent.props.children.toString();
    expect(textContent).toMatch("Zen User");
  });

  test("SubTitle should render a string of letters, numbers or spaces", () => {
    const { getByTestId } = welcomeScreenRender;
    const subTitleComponent = getByTestId("user-email");
    const textContent = subTitleComponent.props.children.toString();
    expect(textContent).toMatch("serenity@gmail.com");
  });
});

// WelcomeImage
describe("WelcomeImage", () => {
  afterEach(() => {
    cleanup();
  });

  test("Render the WelcomePage component correctly and has a valid image source", () => {
    const { getByTestId } = welcomeScreenRender;
    const welcomeImageComponent = getByTestId("welcome-image");
    expect(welcomeImageComponent).toBeTruthy();
  });
});

// Avatar
describe("AvatarImage", () => {
  afterEach(() => {
    cleanup();
  });

  test("Render the AvatarImage component correctly and has a valid image source", () => {
    const { getByTestId } = welcomeScreenRender;
    const avatarImageComponent = getByTestId("avatar-image");
    expect(avatarImageComponent).toBeTruthy();
  });
});

// Logout ButtonText
describe("Logout ButtonText", () => {
  afterEach(() => {
    cleanup();
  });

  test("Renders ButtonText with the correct text", () => {
    const { getByTestId } = welcomeScreenRender;
    const styledButtonElement = getByTestId("logout-button-text");
    const textContent = styledButtonElement.toString();
    expect(styledButtonElement).toBeTruthy();
    expect(textContent).toMatchSnapshot("Logout");
  });
});

// Navigation Test

describe("WelcomeScreen navigation", () => {
  let navigation;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
    welcomeScreenRender = render(
      <WelcomeScreen navigation={navigation} route={{ params: {} }} />
    );
  });

  afterEach(() => {
    cleanup();
  });

  test("navigate to LoginScreen when Logout button is clicked", () => {
    const { getByTestId } = welcomeScreenRender;
    const styledButtonElement = getByTestId("logout-styled-button");
    act(() => {
      fireEvent.press(styledButtonElement);
    });
    expect(navigation.navigate).toHaveBeenCalledWith("LoginScreen");
  });
});
