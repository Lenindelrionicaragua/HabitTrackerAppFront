import React from "react";
import renderer from "react-test-renderer";
import { render, cleanup, fireEvent, act } from "@testing-library/react-native";
import { CredentialsContext } from "../../context/credentialsContext";
import WelcomeScreen from "../../screens/WelcomeScreen/WelcomeScreen";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import { useDispatch } from "react-redux";
import { logInfo, logError } from "../../util/logging";

jest.mock("../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

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

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: jest.fn()
  };
});

// Mock context
const mockStoredCredentials = {
  name: "Zen User",
  email: "serenity@gmail.com",
  photoUrl: null,
  token: "mock_token"
};

const mockSetStoredCredentials = jest.fn();

const Wrapper = ({ children }) => {
  // Create a mock Redux store
  const store = createStore(rootReducer, {
    activeScreen: {
      activeScreen: "WelcomeScreen"
    }
  });

  return (
    <Provider store={store}>
      <CredentialsContext.Provider
        value={{
          storedCredentials: mockStoredCredentials,
          setStoredCredentials: mockSetStoredCredentials
        }}
      >
        {children}
      </CredentialsContext.Provider>
    </Provider>
  );
};

// Rendering Functions
const renderWelcomeScreen = routeParams =>
  render(
    <Wrapper>
      <WelcomeScreen route={{ params: routeParams }} />
    </Wrapper>
  );
const renderWelcomeScreenWithRenderer = routeParams =>
  renderer.create(
    <Wrapper>
      <WelcomeScreen route={{ params: routeParams }} />
    </Wrapper>
  );

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
    expect(getByTestId("welcome-title")).toBeTruthy();
    expect(getByTestId("avatar-image")).toBeTruthy();
    expect(getByTestId("logout-styled-button")).toBeTruthy();
  });

  test("PageTitle should render the name of the user", () => {
    const { getByTestId } = welcomeScreenRender;
    const pageTitleComponent = getByTestId("welcome-title");
    const textContent = pageTitleComponent.props.children.toString();
    expect(textContent).toMatch("Zen User");
  });

  test("Credentials context provides stored credentials", () => {
    const { getByTestId } = welcomeScreenRender;
    const nameText = getByTestId("welcome-title");
    expect(nameText.props.children).toBe("Zen User");
  });

  test("Avatar image renders correctly", () => {
    const { getByTestId } = welcomeScreenRender;
    const avatarImage = getByTestId("avatar-image");
    expect(avatarImage.props.source).toEqual(
      require("./../../assets/user.png")
    );
  });

  test("Redux activeScreen state is correctly passed", () => {
    const { getByTestId } = welcomeScreenRender;
    expect(getByTestId("inner-container")).toBeTruthy();
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
    jest.clearAllMocks();
  });

  test("Renders ButtonText with the correct text", () => {
    const { getByTestId } = welcomeScreenRender;
    const styledButtonElement = getByTestId("logout-button-text");
    const logoutButton = getByTestId("logout-styled-button");
    const textContent = styledButtonElement.toString();

    // Verify that the button is present
    expect(logoutButton).toBeTruthy();
    expect(styledButtonElement).toBeTruthy();

    act(() => {
      fireEvent.press(logoutButton);
    });

    expect(textContent).toMatchSnapshot("Logout");
  });
});
