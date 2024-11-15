import { renderHook, act } from "@testing-library/react-hooks";
import { useHandleError } from "../../hooks/useHandleError";
import { logError } from "../../util/logging";

jest.mock("../../util/logging", () => ({
  logError: jest.fn()
}));

describe("useHandleError", () => {
  it("should return null success and empty errorMessage when there is no error", () => {
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();

    renderHook(() => useHandleError(null, setSuccess, setErrorMessage, false));

    expect(setSuccess).not.toHaveBeenCalled();
    expect(setErrorMessage).not.toHaveBeenCalled();
  });

  it("should set success to false and errorMessage when an error is passed", () => {
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();
    const error = new Error("Something went wrong");

    renderHook(() => useHandleError(error, setSuccess, setErrorMessage, false));

    expect(setSuccess).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith("Something went wrong");
  });

  it("should clear the errorMessage after 3 seconds", () => {
    jest.useFakeTimers();
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();
    const error = new Error("Something went wrong");

    renderHook(() => useHandleError(error, setSuccess, setErrorMessage, false));

    // Check that setSuccess and setErrorMessage were called correctly
    expect(setSuccess).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith("Something went wrong");

    // Advance timers by 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Ensure setErrorMessage is called with an empty string after timeout
    expect(setErrorMessage).toHaveBeenCalledWith("");

    // Clean up timers
    jest.useRealTimers();
  });

  it("should log the error message when an error occurs", () => {
    const error = new Error("Something went wrong");
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();

    renderHook(() => useHandleError(error, setSuccess, setErrorMessage, false));

    // Check that logError was called with the correct message
    expect(logError).toHaveBeenCalledWith("Error: Something went wrong");
  });

  it("should not handle the same error more than once until resetErrorFlag is true", () => {
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();
    const error = new Error("Something went wrong");

    // First call with error
    const { rerender } = renderHook(
      ({ error, resetErrorFlag }) =>
        useHandleError(error, setSuccess, setErrorMessage, resetErrorFlag),
      { initialProps: { error, resetErrorFlag: false } }
    );

    // Check if error was handled
    expect(setSuccess).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith("Something went wrong");

    // Rerender without resetting the flag (should not handle again)
    rerender({ error, resetErrorFlag: false });

    expect(setSuccess).toHaveBeenCalledTimes(1); // Should not call again
    expect(setErrorMessage).toHaveBeenCalledTimes(1); // Should not call again

    // Now trigger resetErrorFlag to true and rerender
    rerender({ error, resetErrorFlag: true });

    // Check that the error is handled again because resetErrorFlag was true
    expect(setSuccess).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith("Something went wrong");
  });
});
