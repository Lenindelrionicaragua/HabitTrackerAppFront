import { renderHook, act } from "@testing-library/react-hooks";
import { useButtonHandler } from "../../util/handleButtonPress";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useButtonHandler", () => {
  test("should initialize with empty activeButtons state", () => {
    const { result } = renderHook(() => useButtonHandler());
    expect(result.current.activeButtons).toEqual({});
  });

  test("should activate and deactivate a button correctly", () => {
    const { result } = renderHook(() => useButtonHandler());
    const buttonId = "button1";

    act(() => {
      result.current.handleButtonPress(buttonId);
    });

    expect(result.current.activeButtons[buttonId]).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.activeButtons[buttonId]).toBe(false);
  });

  test("should only allow one button to be active at a time", () => {
    const { result } = renderHook(() => useButtonHandler());
    const buttonId1 = "button1";
    const buttonId2 = "button2";

    act(() => {
      result.current.handleButtonPress(buttonId1);
    });

    // Verify only the first button is active
    expect(result.current.activeButtons[buttonId1]).toBe(true);
    expect(result.current.activeButtons[buttonId2]).toBeUndefined();

    // Now press the second button
    act(() => {
      result.current.handleButtonPress(buttonId2);
    });

    // Verify only the second button is active
    expect(result.current.activeButtons[buttonId1]).toBe(false);
    expect(result.current.activeButtons[buttonId2]).toBe(true);

    // Wait for the timeout to complete
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Verify both buttons are inactive after timeout
    expect(result.current.activeButtons[buttonId1]).toBe(false);
    expect(result.current.activeButtons[buttonId2]).toBe(false);
  });
});
