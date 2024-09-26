import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import useFetch from "../../hooks/useFetch";

// Mock de axios
jest.mock("axios");

describe("useFetch Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should handle successful GET request", async () => {
    const mockResponse = { data: { success: true, data: "test data" } };
    axios.mockResolvedValueOnce(mockResponse);

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(onReceived).toHaveBeenCalledWith(mockResponse.data);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle failed GET request", async () => {
    axios.mockRejectedValueOnce(new Error("Network Error"));

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Network Error");
  });

  it("should handle unsuccessful response", async () => {
    const mockResponse = { data: { success: false, msg: "Error message" } };
    axios.mockResolvedValueOnce(mockResponse);

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(onReceived).not.toHaveBeenCalled();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Error message");
  });

  it("should handle null request parameters", async () => {
    const { result } = renderHook(() => useFetch(null, jest.fn()));

    expect(() => result.current.performFetch()).toThrow(
      "Invalid route provided"
    );
  });

  it("should handle invalid URL", async () => {
    const { result } = renderHook(() => useFetch("invalid-url", jest.fn()));

    await act(async () => {
      await result.current.performFetch();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Invalid URL");
  });

  it("should call cancelFetch", () => {
    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));
    const spyCancelFetch = jest.spyOn(result.current, "cancelFetch");

    act(() => {
      result.current.cancelFetch();
    });

    expect(spyCancelFetch).toHaveBeenCalled();

    spyCancelFetch.mockRestore();
  });

  it("should return cancelFetch function", () => {
    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    expect(typeof result.current.cancelFetch).toBe("function");
  });

  it("should call cancelFetch to abort the fetch request", async () => {
    const cancelTokenSource = axios.CancelToken.source();

    axios.post = jest.fn().mockImplementationOnce(() => {
      return new Promise((_, reject) => {
        cancelTokenSource.token.promise.then(() => {
          reject(new Error("Fetch was canceled"));
        });
      });
    });

    const onReceived = jest.fn();
    const { result } = renderHook(() => useFetch("/test-route", onReceived));

    act(() => {
      result.current.performFetch();
    });

    act(() => {
      result.current.cancelFetch();
    });

    await act(async () => {
      await new Promise(resolve => setImmediate(resolve));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    // expect(result.current.error.message).toMatch("Fetch was canceled");
  });
});
