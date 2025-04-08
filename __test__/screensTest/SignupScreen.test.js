import React from "react";
import renderer from "react-test-renderer";
import {
  render,
  fireEvent,
  act,
  waitFor,
  cleanup
} from "@testing-library/react-native";
import { Formik } from "formik";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import SignupScreen from "../../screens/SignupScreen/SignupScreen";
import rootReducer from "../../reducers/rootReducer";
import { CredentialsContext } from "../../context/credentialsContext";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { setActiveScreen } from "../../actions/counterActions";
// import axios from "axios";
// import MockAdapter from "axios-mock-adapter";
// Rendering Functions

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

// Create a mock store with initial state
const initialState = {
  activeScreen: {
    activeScreen: "mockActiveScreen"
  }
};

const store = createStore(rootReducer, initialState);

// Function to render LoginScreen wrapped in Provider, CredentialsContext, and NavigationContainer
const renderSignupScreen = () =>
  render(
    <Provider store={store}>
      <CredentialsContext.Provider
        value={{ storedCredentials: null, setStoredCredentials: jest.fn() }}>
        <NavigationContainer>
          <SignupScreen />
        </NavigationContainer>
      </CredentialsContext.Provider>
    </Provider>
  );

const renderSignupScreenWithRenderer = () =>
  renderer.create(
    <Provider store={store}>
      <CredentialsContext.Provider
        value={{ storedCredentials: null, setStoredCredentials: jest.fn() }}>
        <NavigationContainer>
          <SignupScreen />
        </NavigationContainer>
      </CredentialsContext.Provider>
    </Provider>
  );

let signupScreenRender;
let signupScreenRenderWithRenderer;

beforeEach(() => {
  signupScreenRender = renderSignupScreen();
  signupScreenRenderWithRenderer = renderSignupScreenWithRenderer();
});

//SignupScreen
describe("SignupScreen", () => {
  afterEach(() => {
    cleanup();
  });

  test("Renders correctly the SignupScreen Component", () => {
    const signupScreenSnapshot = signupScreenRenderWithRenderer.toJSON();
    expect(signupScreenSnapshot).toMatchSnapshot();
  });

  test("Render StatusBar correctly", () => {
    const signupScreenInstance = signupScreenRenderWithRenderer.root;
    const statusBar = signupScreenInstance.findByType(StatusBar);
    expect(statusBar).toBeTruthy();
  });

  test("Render UI components correctly", () => {
    const { getByTestId } = signupScreenRender;

    expect(getByTestId("signup-styled-container")).toBeTruthy();
    expect(getByTestId("inner-container")).toBeTruthy();
    expect(getByTestId("signup-page-title")).toBeTruthy();
    expect(getByTestId("signup-page-sub-title")).toBeTruthy();
  });

  test("PageTitle should render a string of letters, numbers, or spaces", () => {
    const { getByTestId } = signupScreenRender;
    const pageTitleComponent = getByTestId("signup-page-title");
    const textContent = pageTitleComponent.props.children.toString();
    expect(textContent).toMatch("Habit Tracker");
  });

  test("SubTitle should render a string of letters, numbers or spaces", () => {
    const { getByTestId } = signupScreenRender;
    const subTitleComponent = getByTestId("signup-page-sub-title");
    const textContent = subTitleComponent.props.children.toString();
    expect(textContent).toMatch("Account Sign Up");
  });
});

// Formik Integration Tests
describe("Formik Integration Tests", () => {
  let formikComponent;

  beforeEach(() => {
    const signupScreenInstance = signupScreenRenderWithRenderer.root;
    formikComponent = signupScreenInstance.findByType(Formik);
  });

  afterEach(() => {
    cleanup();
  });

  test("Render a Formik component", () => {
    expect(formikComponent).toBeTruthy();
  });

  test("Should have initialValues", () => {
    expect(formikComponent.props.initialValues).toEqual({
      name: "",
      email: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: ""
    });
  });

  test("Should have a function as a child", () => {
    expect(typeof formikComponent.props.children).toBe("function");
  });

  //TextInputSignupScreen
  describe("TextInputSingupScreen", () => {
    let name;
    let emailInput;
    let dateOfBirth;
    let passwordInput;
    let confirmPasswordInput;

    const renderForm = () => {
      const { getByTestId } = signupScreenRender;
      name = getByTestId("name");
      emailInput = getByTestId("signup-screen-email-input");
      dateOfBirth = getByTestId("date-of-birth");
      passwordInput = getByTestId("signup-screen-password-input");
      confirmPasswordInput = getByTestId("confirm-password-input");
    };

    beforeEach(() => {
      renderForm();
    });

    afterEach(() => {
      cleanup();
    });

    describe("Rendering", () => {
      test("Renders correctly the name", () => {
        expect(name).toBeTruthy();
      });

      test("Renders correctly the email-input", () => {
        expect(emailInput).toBeTruthy();
      });

      test("Renders correctly the date-of-birth", () => {
        expect(dateOfBirth).toBeTruthy();
      });

      test("Renders correctly the password-input", () => {
        expect(passwordInput).toBeTruthy();
      });

      test("Renders correctly the confirm-password-input", () => {
        expect(confirmPasswordInput).toBeTruthy();
      });
    });
  });

  describe("DateTimePicker", () => {
    let dateOfBirth;

    const renderForm = () => {
      const { getByTestId } = signupScreenRender;
      dateOfBirth = getByTestId("date-of-birth");
    };

    beforeEach(() => {
      renderForm();
    });

    afterEach(() => {
      cleanup();
    });

    test("Renders correctly the date-of-birth input field", () => {
      expect(dateOfBirth).toBeTruthy();
    });

    test("Show DateTimePicker after clicking on the date-of-birth input field", async () => {
      act(() => {
        fireEvent.press(dateOfBirth);
      });

      await waitFor(() => {
        const dateTimePicker =
          signupScreenRender.queryByTestId("date-time-picker");
        expect(dateTimePicker).toBeTruthy();
      });
    });

    test("Change date in DateTimePicker", async () => {
      act(() => {
        fireEvent.press(dateOfBirth);
      });

      await waitFor(() => {
        const dateTimePicker =
          signupScreenRender.queryByTestId("date-time-picker");
        expect(dateTimePicker).toBeTruthy();

        act(() => {
          fireEvent(dateTimePicker, "onChange", {
            nativeEvent: { timestamp: "Tue Feb 01 2022" }
          });
        });
      });

      await waitFor(() => {
        expect(dateOfBirth.props.value).toBe("Tue Feb 01 2022");
      });
    });
  });

  // Login StyledButton
  describe("StyledButton", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render StyledButton", () => {
      const { getByTestId } = signupScreenRender;
      const styledButtonElement = getByTestId("signup-styled-button");
      expect(styledButtonElement).toBeTruthy();
    });
  });

  // MsgBox
  describe("MsgBox", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render a MsgBox", () => {
      const { getByTestId } = signupScreenRender;
      const msgBoxElement = getByTestId("msg-box");
      expect(msgBoxElement).toBeTruthy();
    });

    test("MsgBox should render a string of letters, numbers or spaces", async () => {
      const { getByTestId } = signupScreenRender;
      const msgBoxElement = getByTestId("msg-box");
      const textContent = msgBoxElement.props.children.toString();
      expect(textContent).toMatch(/^[a-zA-Z0-9.\s]*$/);
    });
  });

  describe("FooterView", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render correctly", () => {
      const { getByTestId } = signupScreenRender;
      const FooterViewElement = getByTestId("footer-view");
      expect(FooterViewElement).toBeTruthy();
    });
  });

  describe("FooterText", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render correctly", () => {
      const { getByTestId } = signupScreenRender;
      const footerTextElement = getByTestId("signup-footer-text");
      expect(footerTextElement).toBeTruthy();
    });

    test("Render the correct text", () => {
      const { getByTestId } = signupScreenRender;
      const footerTextElement = getByTestId("signup-footer-text");
      const textContent = footerTextElement.props.children;
      expect(textContent).toBe("Already have an account?");
    });
  });

  describe("FooterLink", () => {
    afterEach(() => {
      cleanup();
    });

    test("Render correctly", () => {
      const { getByTestId } = signupScreenRender;
      const footerLinkElement = getByTestId("footer-login-link");
      expect(typeof footerLinkElement.props).toBe("object");
    });

    test("Render the correct text", () => {
      const { getByTestId } = signupScreenRender;
      const footerLinkContent = getByTestId("footer-login-link-content");
      const LinkContent = footerLinkContent.props.children;
      expect(LinkContent).toBe("Login");
    });
  });
});

// Navigation Test

describe("SignupScreen navigation", () => {
  let navigation;

  beforeEach(() => {
    navigation = { navigate: jest.fn() };

    // Render the SignupScreen wrapped with the necessary providers
    signupScreenRender = renderSignupScreen();
  });

  afterEach(() => {
    cleanup();
  });

  test("Navigate to LoginScreen when the login link is clicked", () => {
    const mockNavigation = { navigate: jest.fn() };

    const { getByTestId } = render(
      <Provider store={store}>
        <CredentialsContext.Provider
          value={{ storedCredentials: null, setStoredCredentials: jest.fn() }}>
          <NavigationContainer>
            <SignupScreen navigation={mockNavigation} />
          </NavigationContainer>
        </CredentialsContext.Provider>
      </Provider>
    );

    const loginLink = getByTestId("footer-login-link");

    act(() => {
      fireEvent.press(loginLink);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith("LoginScreen");
  });
});
