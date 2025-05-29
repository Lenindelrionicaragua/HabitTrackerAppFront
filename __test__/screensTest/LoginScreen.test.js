import React from "react";
import { render, fireEvent, act, cleanup } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import { Fontisto } from "@expo/vector-icons";
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import { Formik } from "formik";
import { StatusBar } from "react-native";
import { PageLogo } from "../../screens/LoginScreen/LoginScreenStyles";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import { CredentialsContext } from "../../context/credentialsContext";
import { NavigationContainer } from "@react-navigation/native";

// Mock the environment variables
jest.mock("@env", () => ({
  EXPO_CLIENT_ID: "mock_expo_client_id",
  IOS_CLIENT_ID: "mock_ios_client_id",
  ANDROID_CLIENT_ID: "mock_android_client_id",
  WEB_CLIENT_ID: "mock_web_client_id"
}));

// Mock Google auth request
jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: () => [
    jest.fn(), // Mock request function
    {
      type: "success",
      authentication: { accessToken: "mockAccessToken", idToken: "mockIdToken" }
    }, // Mock response
    jest.fn() // Mock promptAsync function
  ]
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

jest.mock("../../hooks/api/useFetch", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    performFetch: jest.fn(),
    isLoading: false,
    error: null,
    data: null
  }))
}));

jest.mock("../../hooks/api/useGoogleFetch", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    performGoogleFetch: jest.fn(),
    isLoading: false,
    error: null,
    data: null
  }))
}));

const initialState = {
  activeScreen: {
    activeScreen: "mockActiveScreen"
  }
};

const store = createStore(rootReducer, initialState);

const renderLoginScreen = () =>
  render(
    <Provider store={store}>
      <CredentialsContext.Provider
        value={{ storedCredentials: null, setStoredCredentials: jest.fn() }}>
        <NavigationContainer>
          <LoginScreen navigation={mockNavigation} />
        </NavigationContainer>
      </CredentialsContext.Provider>
    </Provider>
  );

const renderLoginScreenWithRenderer = () =>
  renderer.create(
    <Provider store={store}>
      <CredentialsContext.Provider
        value={{ storedCredentials: null, setStoredCredentials: jest.fn() }}>
        <NavigationContainer>
          <LoginScreen navigation={mockNavigation} />
        </NavigationContainer>
      </CredentialsContext.Provider>
    </Provider>
  );

let loginScreenRender;
let loginScreenRenderWithRenderer;

beforeEach(() => {
  loginScreenRender = renderLoginScreen();
  loginScreenRenderWithRenderer = renderLoginScreenWithRenderer();
});

describe("LoginScreen", () => {
  afterEach(() => {
    cleanup();
  });

  test("Renders correctly the LoginScreen Component", () => {
    const loginScreenSnapshot = loginScreenRenderWithRenderer.toJSON();
    expect(loginScreenSnapshot).toMatchSnapshot();
  });

  test("Render StatusBar correctly", () => {
    const loginScreenInstance = loginScreenRenderWithRenderer.root;
    const statusBar = loginScreenInstance.findByType(StatusBar);
    expect(statusBar).toBeTruthy();
  });

  test("Render UI components correctly", () => {
    const { getByTestId } = loginScreenRender;

    expect(getByTestId("login-styled-container")).toBeTruthy();
    expect(getByTestId("inner-container")).toBeTruthy();
    expect(getByTestId("page-logo")).toBeTruthy();
    expect(getByTestId("page-title")).toBeTruthy();
    expect(getByTestId("sub-title")).toBeTruthy();
  });

  test("The PageLogo must have a valid image source", () => {
    const { getByTestId } = loginScreenRender;
    const pageLogoComponent = getByTestId("page-logo");
    expect(pageLogoComponent.props.source).toBeTruthy();
  });

  test("PageTitle should render a string of letters, numbers, or spaces", () => {
    const { getByTestId } = loginScreenRender;
    const pageTitleComponent = getByTestId("page-title");
    const textContent = pageTitleComponent.props.children.toString();
    expect(textContent).toMatch("Habit Tracker");
  });

  test("SubTitle should render a string of letters, numbers or spaces", () => {
    const { getByTestId } = loginScreenRender;
    const subTitleComponent = getByTestId("sub-title");
    const textContent = subTitleComponent.props.children.toString();
    expect(textContent).toMatch("Account Login");
  });
});

describe("PageLogo", () => {
  afterEach(() => {
    cleanup();
  });

  it("Renders the PageLogo component correctly", () => {
    const pageLogoSnapshot = renderer.create(<PageLogo />).toJSON();
    expect(pageLogoSnapshot).toMatchSnapshot();
  });
});

describe("Formik Integration Tests", () => {
  let formikComponent;

  beforeEach(() => {
    const loginScreenInstance = loginScreenRenderWithRenderer.root;
    formikComponent = loginScreenInstance.findByType(Formik);
  });

  afterEach(() => {
    cleanup();
  });

  test("Render a Formik component", () => {
    expect(formikComponent).toBeTruthy();
  });

  test("Should have initialValues", () => {
    expect(formikComponent.props.initialValues).toEqual({
      email: "",
      password: ""
    });
  });

  test("Formik should have onSubmit function", () => {
    expect(formikComponent.props.onSubmit).toBeDefined();
  });

  test("Formik should handle onSubmit", () => {
    expect(formikComponent.props.onSubmit).toBeInstanceOf(Function);
  });
});

describe("LoginTextInput", () => {
  let emailInput;
  let passwordInput;

  const renderForm = () => {
    const { getByTestId } = loginScreenRender;
    emailInput = getByTestId("email-input");
    passwordInput = getByTestId("password-input");
  };

  beforeEach(() => {
    renderForm();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    test("Renders correctly the email-input", () => {
      expect(emailInput).toBeTruthy();
    });

    test("Renders correctly the password-input", () => {
      expect(passwordInput).toBeTruthy();
    });
  });

  describe("Form State Update", () => {
    beforeEach(() => {
      renderForm();
    });

    afterEach(() => {
      cleanup();
    });

    test("Correctly updates form state on onChangeText and onBlur", () => {
      const { getByTestId } = loginScreenRender;

      act(() => {
        fireEvent.changeText(getByTestId("email-input"), "serenity@gmail.com");
        fireEvent(getByTestId("email-input"), "blur", {
          target: { value: "serenity@gmail.com" }
        });

        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent(getByTestId("password-input"), "blur", {
          target: { value: "password123" }
        });
      });

      expect(getByTestId("email-input").props.value).toBe("serenity@gmail.com");
      expect(getByTestId("password-input").props.value).toBe("password123");
    });
  });

  describe("StyledButton", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render StyledButton", () => {
      const { getByTestId } = loginScreenRender;
      const styledButtonElement = getByTestId("login-styled-button");
      expect(styledButtonElement).toBeTruthy();
    });
  });

  describe("MsgBox", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render a MsgBox", () => {
      const { getByTestId } = loginScreenRender;
      const msgBoxElement = getByTestId("msg-box");
      expect(msgBoxElement).toBeTruthy();
    });

    test("MsgBox should render a string of letters, numbers or spaces", async () => {
      const { getByTestId } = loginScreenRender;
      const msgBoxElement = getByTestId("msg-box");
      const textContent = msgBoxElement.props.children.toString();
      expect(textContent).toMatch(/^[a-zA-Z0-9.\s]*$/);
    });
  });

  describe("Google StyledButton", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render correctly", () => {
      const { getByTestId } = loginScreenRender;
      const googleStyledButton = getByTestId("google-styled-button");
      expect(googleStyledButton).toBeTruthy();
    });

    test("Render the Google Icon", () => {
      const { getByTestId } = loginScreenRender;
      const googleIconElement = getByTestId("google-icon");
      expect(googleIconElement).toBeTruthy();
    });

    test("Render the correct text", () => {
      const { getByTestId } = loginScreenRender;
      const googleButtonTextElement = getByTestId("google-button-text");
      const textContent = googleButtonTextElement.props.children.toString();
      expect(textContent).toMatch("Sign in with Google");
    });

    test("StyledButton should have an Fontisto component as Child", () => {
      const { getByTestId } = loginScreenRender;
      const styledButtonComponent = getByTestId("google-styled-button");
      const children = styledButtonComponent.props.children;

      let hasFontistoAsAChild = false;

      React.Children.forEach(children, child => {
        if (child && child.type === Fontisto) {
          hasFontistoAsAChild = true;
        }
      });
      expect(hasFontistoAsAChild).toBe(true);
    });

    test("Render a google-button-text", () => {
      const { getByTestId } = loginScreenRender;
      const buttonTextGoogle = getByTestId("google-button-text");
      expect(buttonTextGoogle).toBeTruthy();
    });
  });

  describe("FooterView", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render correctly", () => {
      const { getByTestId } = loginScreenRender;
      const footerViewElement = getByTestId("footer-view");
      expect(footerViewElement).toBeTruthy();
    });
  });

  describe("FooterText", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render correctly", () => {
      const { getByTestId } = loginScreenRender;
      const footerTextElement = getByTestId("footer-text");
      expect(footerTextElement).toBeTruthy();
    });

    test("Render a text", () => {
      const { getByTestId } = loginScreenRender;
      const footerTextElement = getByTestId("footer-text");
      const textContent = footerTextElement.props.children;
      expect(textContent).toBe("Don't you have an account already?");
    });
  });

  describe("SignupLink", () => {
    test("Render correctly", () => {
      const { getByTestId } = loginScreenRender;
      const SignupLinkElement = getByTestId("signup-link");
      expect(typeof SignupLinkElement.props).toBe("object");
    });

    test("Render the correct text", () => {
      const { getByTestId } = loginScreenRender;
      const SignupLinkContent = getByTestId("signup-link-content");
      const LinkContent = SignupLinkContent.props.children;
      expect(LinkContent).toBe("Signup");
    });
  });

  describe("loginScreen navigation", () => {
    afterEach(() => {
      cleanup();
    });

    test("Navigate to SignupScreen when Signup link is clicked", () => {
      const { getByTestId } = render(
        <Provider store={store}>
          <CredentialsContext.Provider
            value={{
              storedCredentials: null,
              setStoredCredentials: jest.fn()
            }}>
            <NavigationContainer>
              <LoginScreen navigation={mockNavigation} />
            </NavigationContainer>
          </CredentialsContext.Provider>
        </Provider>
      );

      const signupLink = getByTestId("signup-link");

      act(() => {
        fireEvent.press(signupLink);
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith("SignupScreen");
    });
  });
});
