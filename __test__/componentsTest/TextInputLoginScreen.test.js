import React from "react";
import { render, fireEvent, act, cleanup } from "@testing-library/react-native";
import TextInputLoginScreen from "../../component/TextInputLoginScreen/TextInputLoginScreen";

describe("TextInputLoginScreen", () => {
  test("Renders correctly", () => {
    const { getByTestId } = render(
      <TextInputLoginScreen
        label="Email"
        icon="mail"
        onChangeText={() => {}}
        value=""
        isPassword={false}
        hidePassword={false}
        setHidePassword={() => {}}
      />
    );
    expect(getByTestId("text-input-login-screen")).toBeTruthy();
  });

  test("Renders label and icon correctly", () => {
    const { getByText, getByTestId } = render(
      <TextInputLoginScreen
        label="Email"
        icon="mail"
        onChangeText={() => {}}
        value=""
        isPassword={false}
        hidePassword={false}
        setHidePassword={() => {}}
      />
    );
    expect(getByText("Email")).toBeTruthy();
    expect(getByTestId("octicons-icon")).toBeTruthy();
  });

  test("Calls handleChange when text is inputted", () => {
    const handleChangeMock = jest.fn();
    const { getByTestId } = render(
      <TextInputLoginScreen
        label="Email"
        icon="mail"
        onChangeText={handleChangeMock}
        value=""
        isPassword={false}
        hidePassword={false}
        setHidePassword={() => {}}
      />
    );

    const textInput = getByTestId("styled-text-input-login-screen");

    act(() => {
      fireEvent.changeText(textInput, "newText");
    });

    expect(handleChangeMock).toHaveBeenCalledWith("newText");
  });

  afterEach(() => {
    cleanup();
  });
});
