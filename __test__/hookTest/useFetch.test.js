import { renderHook, act } from "@testing-library/react-hooks";
import useFetch from "../../hooks/useFetch";

describe("useFetch Hook", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should handle successful GET request", async () => {
    const mockResponse = { success: true, data: "test data" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse)
    });

    const onReceived = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/test-route", onReceived)
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(onReceived).toHaveBeenCalledWith(mockResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should call cancelFetch to abort the fetch request", async () => {
    fetch.mockImplementationOnce((url, options) => {
      return new Promise((_, reject) => {
        options.signal.onabort = () => {
          reject(new Error("Fetch was canceled"));
        };
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
    expect(result.current.error.message).toMatch("Fetch was canceled");
  });
});
