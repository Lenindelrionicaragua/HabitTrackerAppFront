import React from "react";
import { render, act, fireEvent, cleanup } from "@testing-library/react-native";
import TextInputSignupScreen from "../../component/TextInputSignupScreen/TextInputSignupScreen";

describe("TextInputSignupScreen", () => {
  afterEach(cleanup);

  const baseProps = {
    label: "Test Label",
    icon: "person",
    onChangeText: jest.fn(),
    onBlur: jest.fn(),
    value: ""
  };

  test("renders main container correctly", () => {
    const { getByTestId } = render(
      <TextInputSignupScreen {...baseProps} isPassword={false} isDate={false} />
    );

    expect(getByTestId("text-input-signup-screen")).toBeTruthy();
  });

  test("displays label correctly", () => {
    const { getByText } = render(
      <TextInputSignupScreen {...baseProps} isPassword={false} isDate={false} />
    );

    expect(getByText("Test Label")).toBeTruthy();
  });

  test("displays icon correctly", () => {
    const { getByTestId } = render(
      <TextInputSignupScreen {...baseProps} isPassword={false} isDate={false} />
    );

    const leftIcon = getByTestId("left-icon");
    expect(leftIcon).toBeTruthy();
    expect(leftIcon.props.children.props.name).toBe("person");
  });

  test("calls onChangeText when typing text", () => {
    const handleChangeMock = jest.fn();
    const { getByTestId } = render(
      <TextInputSignupScreen
        {...baseProps}
        onChangeText={handleChangeMock}
        isPassword={false}
        isDate={false}
      />
    );

    const input = getByTestId("styled-text-input-signup-screen");

    act(() => {
      fireEvent.changeText(input, "new text");
    });

    expect(handleChangeMock).toHaveBeenCalledWith("new text");
  });

  test("renders date input when isDate is true", () => {
    const handleChangeMock = jest.fn();
    const { getByTestId } = render(
      <TextInputSignupScreen
        {...baseProps}
        isDate={true}
        onChangeText={handleChangeMock}
        showDatePicker={jest.fn()}
      />
    );

    const dateInput = getByTestId("styled-date-text-input-signup-screen");
    expect(dateInput).toBeTruthy();
  });

  test("calls onChangeText for date input", () => {
    const handleChangeMock = jest.fn();
    const { getByTestId } = render(
      <TextInputSignupScreen
        {...baseProps}
        isDate={true}
        onChangeText={handleChangeMock}
        showDatePicker={jest.fn()}
      />
    );

    const dateInput = getByTestId("styled-date-text-input-signup-screen");

    act(() => {
      fireEvent.changeText(dateInput, "new date");
    });

    expect(handleChangeMock).toHaveBeenCalledWith("new date");
  });

  test("renders password toggle icon when isPassword is true", () => {
    const setHidePasswordMock = jest.fn();
    const { getByTestId } = render(
      <TextInputSignupScreen
        {...baseProps}
        isPassword={true}
        hidePassword={true}
        setHidePassword={setHidePasswordMock}
      />
    );

    const rightIcon = getByTestId("right-icon");
    expect(rightIcon).toBeTruthy();
  });

  test("toggles password visibility when icon is pressed", () => {
    const setHidePasswordMock = jest.fn();
    const { getByTestId } = render(
      <TextInputSignupScreen
        {...baseProps}
        isPassword={true}
        hidePassword={true}
        setHidePassword={setHidePasswordMock}
      />
    );

    const rightIcon = getByTestId("right-icon");

    act(() => {
      fireEvent.press(rightIcon);
    });

    expect(setHidePasswordMock).toHaveBeenCalledWith(false);
  });
});
