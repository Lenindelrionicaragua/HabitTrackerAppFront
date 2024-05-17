import { render, cleanup } from "@testing-library/react-native";
import KeyboardAvoider from "../../component/KeyboardAvoider/KeyboardAvoider";

describe("KeyboardAvoider", () => {
  let KeyboardAvoiderRender;

  beforeEach(() => {
    KeyboardAvoiderRender = render(<KeyboardAvoider />);
  });

  test("Render KeyboardAvoidingView", () => {
    const keyboardAvoiderComponent = KeyboardAvoiderRender.getByTestId(
      "keyboard-avoiding-view"
    );
    expect(keyboardAvoiderComponent).toBeTruthy();
  });

  test("Render ScrollView", () => {
    const scrollView = KeyboardAvoiderRender.getByTestId("scroll-view");
    expect(scrollView).toBeTruthy();
  });

  test("Render Pressable", () => {
    const touchableWithoutFeedback =
      KeyboardAvoiderRender.getByTestId("pressable");
    expect(touchableWithoutFeedback).toBeTruthy();
  });

  afterEach(() => {
    cleanup();
  });
});
