import React from "react";
import { render, fireEvent, act, cleanup } from "@testing-library/react-native";
import TextInputLoginScreen from "../../component/TextInputLoginScreen/TextInputLoginScreen";

describe("TextInputLoginScreen", () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    label: "Email",
    icon: "mail",
    onChangeText: jest.fn(),
    value: "",
    isPassword: false,
    hidePassword: false,
    setHidePassword: jest.fn()
  };

  test("renders text input component", () => {
    const { getByTestId } = render(<TextInputLoginScreen {...defaultProps} />);
    expect(getByTestId("text-input-login-screen")).toBeTruthy();
  });

  test("renders label and icon correctly", () => {
    const { getByText, getByTestId } = render(
      <TextInputLoginScreen {...defaultProps} />
    );
    expect(getByText("Email")).toBeTruthy();
    expect(getByTestId("octicons-icon")).toBeTruthy();
  });

  test("calls onChangeText when input changes", () => {
    const handleChangeMock = jest.fn();
    const { getByTestId } = render(
      <TextInputLoginScreen {...defaultProps} onChangeText={handleChangeMock} />
    );

    const textInput = getByTestId("styled-text-input-login-screen");

    act(() => {
      fireEvent.changeText(textInput, "newText");
    });

    expect(handleChangeMock).toHaveBeenCalledWith("newText");
  });
});
