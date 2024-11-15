import { renderHook, act } from "@testing-library/react-hooks";
import { useHandleError } from "../../hooks/useHandleError";
import { logError } from "../../util/logging";

jest.mock("../../util/logging", () => ({
  logError: jest.fn()
}));

describe("useHandleError", () => {
  it("should return null success and empty errorMessage when there is no error", () => {
    const { result } = renderHook(() => useHandleError(null));

    expect(result.current.success).toBeNull();
    expect(result.current.errorMessage).toBe("");
  });

  it("should set success to false and errorMessage when an error is passed", () => {
    const error = new Error("Something went wrong");

    const { result } = renderHook(() => useHandleError(error));

    expect(result.current.success).toBe(false);
    expect(result.current.errorMessage).toBe("Something went wrong");
  });

  it("should clear the errorMessage after 3 seconds", () => {
    jest.useFakeTimers();
    const error = new Error("Something went wrong");

    const { result } = renderHook(() => useHandleError(error));

    // Check the initial state
    expect(result.current.success).toBe(false);
    expect(result.current.errorMessage).toBe("Something went wrong");

    // Advance timers by 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Check that the errorMessage is cleared after the timeout
    expect(result.current.errorMessage).toBe("");

    // Clean up timers
    jest.useRealTimers();
  });

  it("should log the error message when an error occurs", () => {
    const error = new Error("Something went wrong");

    renderHook(() => useHandleError(error));

    // Check that logError was called with the correct message
    expect(logError).toHaveBeenCalledWith("Error: Something went wrong");
  });
});
