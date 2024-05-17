import React from "react";
import { render, fireEvent, act, cleanup } from "@testing-library/react-native";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import renderer from "react-test-renderer";
import { Fontisto } from "@expo/vector-icons";
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import { Formik } from "formik";
import { StatusBar } from "react-native";
import { PageLogo } from "../../screens/LoginScreen/LoginScreenStyles";

// Rendering Functions
const renderLoginScreen = () => render(<LoginScreen />);
const renderLoginScreenWithRenderer = () => renderer.create(<LoginScreen />);

let loginScreenRender;
let loginScreenRenderWithRenderer;

beforeEach(async () => {
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

  test("Render StatusBar correctly", () => {
    const loginScreenInstance = loginScreenRenderWithRenderer.root;
    const statusBar = loginScreenInstance.findByType(StatusBar);
    expect(statusBar).toBeTruthy();
  });

  test("Render UI components correctly", () => {
    const { getByTestId } = loginScreenRender;

    expect(getByTestId("styled-container")).toBeTruthy();
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
    expect(textContent).toMatch("ZenTimer");
  });

  test("SubTitle should render a string of letters, numbers or spaces", () => {
    const { getByTestId } = loginScreenRender;
    const subTitleComponent = getByTestId("sub-title");
    const textContent = subTitleComponent.props.children.toString();
    expect(textContent).toMatch("Account Login");
  });
});

// PageLogo
describe("PageLogo", () => {
  afterEach(() => {
    cleanup();
  });

  it("Renders the PageLogo component correctly", () => {
    const pageLogoSnapshot = renderer.create(<PageLogo />).toJSON();
    expect(pageLogoSnapshot).toMatchSnapshot();
  });
});

// Formik Integration Tests
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

// LoginTextInput
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

  // Login StyledButton
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

  // MsgBox
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

    // Google StyledButton
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

  // Footer
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
      expect(textContent).toBe("Dont you have an account already?");
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

  //Navigation Test

  describe("loginScreen navigation", () => {
    let loginScreenInstance;
    let navigation;

    beforeEach(() => {
      navigation = { navigate: jest.fn() };

      const loginScreenRenderWithRenderer = renderer.create(
        <LoginScreen navigation={navigation} />
      );
      loginScreenInstance = loginScreenRenderWithRenderer.root;
    });

    afterEach(() => {
      cleanup();
    });

    test("Navigate to SignupScreen when Signup link is clicked", () => {
      const { getByTestId } = render(<LoginScreen navigation={navigation} />);
      const signupLink = getByTestId("signup-link");

      act(() => {
        fireEvent.press(signupLink);
      });

      expect(navigation.navigate).toHaveBeenCalledWith("SignupScreen");
    });

    test("navigate to WelcomeScreen when Login button is clicked", async () => {
      const mock = new MockAdapter(axios);
      const formikComponent = loginScreenInstance.findByType(Formik);
      const handleLogin = formikComponent.props.onSubmit;
      const setSubmitting = jest.fn();

      const url =
        "https://zen-timer-app-server-7f9db58def4c.herokuapp.com/api/auth/log-in";

      mock.onPost(url).reply(200, {
        success: true,
        msg: "Login successful",
        user: {
          id: "6638d16d96bf8c3d0d4cf2e4",
          email: "johnlenin@email.com",
          name: "John Lenin"
        }
      });

      await act(async () => {
        await handleLogin(
          { email: "johnlenin@email.com", password: "Password1234!" },
          { setSubmitting }
        );
      });

      expect(navigation.navigate).toHaveBeenCalledWith("WelcomeScreen", {
        id: "6638d16d96bf8c3d0d4cf2e4",
        email: "johnlenin@email.com",
        name: "John Lenin"
      });

      expect(setSubmitting).toHaveBeenCalledWith(false);
    });

    test("navigate to WelcomeScreen should fail if request does not have a valid email", async () => {
      const mock = new MockAdapter(axios);
      const formikComponent = loginScreenInstance.findByType(Formik);
      const handleLogin = formikComponent.props.onSubmit;
      const setSubmitting = jest.fn();

      const url =
        "https://zen-timer-app-server-7f9db58def4c.herokuapp.com/api/auth/log-in";

      mock.onPost(url).reply(200, {
        success: false,
        error: "BAD REQUEST: Email and password are required."
      });

      await act(async () => {
        await handleLogin(
          { email: "", password: "Password1234!" },
          { setSubmitting }
        );
      });

      expect(navigation.navigate).not.toHaveBeenCalled();
      expect(setSubmitting).toHaveBeenCalledWith(false);
    });

    test("navigate to WelcomeScreen should fail if request does not have a valid password", async () => {
      const mock = new MockAdapter(axios);
      const formikComponent = loginScreenInstance.findByType(Formik);
      const handleLogin = formikComponent.props.onSubmit;
      const setSubmitting = jest.fn();

      const url =
        "https://zen-timer-app-server-7f9db58def4c.herokuapp.com/api/auth/log-in";

      mock.onPost(url).reply(200, {
        success: false,
        error: "BAD REQUEST: Email and password are required."
      });

      await act(async () => {
        await handleLogin(
          { email: "johnlenin@email.com", password: "" },
          { setSubmitting }
        );
      });

      expect(navigation.navigate).not.toHaveBeenCalled();
      expect(setSubmitting).toHaveBeenCalledWith(false);
    });

    test("navigate to WelcomeScreen should fail if request is an empty object", async () => {
      const mock = new MockAdapter(axios);
      const formikComponent = loginScreenInstance.findByType(Formik);
      const handleLogin = formikComponent.props.onSubmit;
      const setSubmitting = jest.fn();

      const url =
        "https://zen-timer-app-server-7f9db58def4c.herokuapp.com/api/auth/log-in";

      mock.onPost(url).reply(200, {
        success: false,
        msg: "Invalid request body"
      });

      await act(async () => {
        await handleLogin({}, { setSubmitting });
      });

      expect(navigation.navigate).not.toHaveBeenCalled();
      expect(setSubmitting).toHaveBeenCalledWith(false);
    });
  });
});
