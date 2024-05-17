import React from "react";
import { render, act, fireEvent, cleanup } from "@testing-library/react-native";
import TextInputSignupScreen from "../../component/TextInputSignupScreen/TextInputSignupScreen";

describe("TextInputSignupScreen", () => {
  test("renders correctly", () => {
    const { getByTestId } = render(
      <TextInputSignupScreen
        label="Test Label"
        icon="person"
        isPassword={false}
        isDate={false}
        onChangeText={() => {}}
        onBlur={() => {}}
        value=""
      />
    );

    expect(getByTestId("text-input-signup-screen")).toBeDefined();
  });

  test("displays label correctly", () => {
    const label = "Test Label";
    const { getByText } = render(
      <TextInputSignupScreen
        label={label}
        icon="person"
        isPassword={false}
        isDate={false}
        onChangeText={() => {}}
        onBlur={() => {}}
        value=""
      />
    );

    expect(getByText(label)).toBeDefined();
  });

  test("displays icon correctly", () => {
    const icon = "person";
    const { getByTestId } = render(
      <TextInputSignupScreen
        label="Test Label"
        icon={icon}
        isPassword={false}
        isDate={false}
        onChangeText={() => {}}
        onBlur={() => {}}
        value=""
      />
    );

    const leftIcon = getByTestId("left-icon");
    expect(leftIcon).toBeDefined();
    expect(leftIcon.props.children.props.name).toBe(icon);
  });

  test("Calls handleChange when text is inputted", () => {
    const handleChangeMock = jest.fn();
    const { getByTestId } = render(
      <TextInputSignupScreen
        label="Test Label"
        icon="person"
        isPassword={false}
        isDate={false}
        onChangeText={(text) => handleChangeMock(text)}
        onBlur={() => {}}
        value=""
      />
    );

    const textInput = getByTestId("styled-text-input-signup-screen");

    act(() => {
      fireEvent.changeText(textInput, "newText");
    });

    expect(handleChangeMock).toHaveBeenCalledWith("newText");
  });

  test("Calls handleChange when date text is inputted", () => {
    const handleChangeMock = jest.fn();
    const { getByTestId } = render(
      <TextInputSignupScreen
        label="Test Label"
        icon="person"
        isPassword={false}
        isDate={true}
        onChangeText={(text) => handleChangeMock(text)}
        onBlur={() => {}}
        value=""
      />
    );

    const textDataInput = getByTestId("styled-date-text-input-signup-screen");

    act(() => {
      fireEvent.changeText(textDataInput, "newText");
    });

    expect(handleChangeMock).toHaveBeenCalledWith("newText");
  });

  afterEach(() => {
    cleanup();
  });
});
