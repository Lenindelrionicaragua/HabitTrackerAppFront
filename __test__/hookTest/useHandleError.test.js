import { renderHook, act } from "@testing-library/react-hooks";
import { useHandleError } from "../../hooks/useHandleError";
import { logError } from "../../util/logging";

jest.mock("../../util/logging", () => ({
  logError: jest.fn()
}));

describe("useHandleError", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

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
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();
    const error = new Error("Something went wrong");

    renderHook(() => useHandleError(error, setSuccess, setErrorMessage));

    expect(setSuccess).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith("Something went wrong");

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(setErrorMessage).toHaveBeenNthCalledWith(2, "");
  });

  it("should log the error message when an error occurs", () => {
    const error = new Error("Something went wrong");
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();

    renderHook(() => useHandleError(error, setSuccess, setErrorMessage));

    expect(logError).toHaveBeenCalledWith("Error: Something went wrong");
  });

  it("should reset the state when resetErrorState is called", () => {
    const setSuccess = jest.fn();
    const setErrorMessage = jest.fn();
    const error = new Error("Something went wrong");

    const { result } = renderHook(() =>
      useHandleError(error, setSuccess, setErrorMessage)
    );

    expect(setSuccess).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith("Something went wrong");

    // Act to call the resetErrorState function
    act(() => {
      result.current.resetErrorState();
    });

    // Check that the internal states are reset
    expect(setSuccess).toHaveBeenCalledWith(null);
    expect(setErrorMessage).toHaveBeenCalledWith("");
  });
});
