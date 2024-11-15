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

    renderHook(() => useHandleError(null, setSuccess, setErrorMessage));

    expect(setSuccess).not.toHaveBeenCalled();
    expect(setErrorMessage).not.toHaveBeenCalled();
  });

  it("should set success to false and errorMessage when an error is passed", () => {
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();
    const error = new Error("Something went wrong");

    renderHook(() => useHandleError(error, setSuccess, setErrorMessage));

    expect(setSuccess).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith("Something went wrong");
  });

  it("should clear the errorMessage after 3 seconds", () => {
    jest.useFakeTimers();
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();
    const error = new Error("Something went wrong");

    renderHook(() => useHandleError(error, setSuccess, setErrorMessage));

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

    renderHook(() => useHandleError(error, setSuccess, setErrorMessage));

    // Check that logError was called with the correct message
    expect(logError).toHaveBeenCalledWith("Error: Something went wrong");
  });
});
