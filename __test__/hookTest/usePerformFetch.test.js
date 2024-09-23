import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import usePerformFetch from "../../hooks/usePerformFetch";

// Mock axios
jest.mock("axios");

describe("usePerformFetch", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle successful GET request", async () => {
    const mockData = { success: true, data: "test data" };
    axios.mockResolvedValueOnce({ data: mockData });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePerformFetch("https://example.com", "GET")
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(true);
  });

  it("should handle successful POST request", async () => {
    const mockResponse = { success: true, message: "Data posted successfully" };
    axios.mockResolvedValueOnce({ data: mockResponse });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePerformFetch("https://example.com", "POST", { key: "value" })
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(true);
  });

  it("should handle failed GET request", async () => {
    const errorMessage = "Network Error";
    axios.mockRejectedValueOnce(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() =>
      usePerformFetch("https://example.com", "GET")
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.success).toBe(false);
  });

  it("should handle failed POST request", async () => {
    const errorMessage = "Server Error";
    axios.mockRejectedValueOnce(new Error(errorMessage));

    const { result, waitForNextUpdate } = renderHook(() =>
      usePerformFetch("https://example.com", "POST", { key: "value" })
    );

    act(() => {
      result.current.performFetch();
    });

    await waitForNextUpdate();

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.success).toBe(false);
  });
});

describe("usePerformFetch Hook", () => {
  beforeEach(() => {
    axios.mockClear();
  });

  it("should handle null request parameters", async () => {
    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      await result.current.performFetch(null);
      expect(result.current.error).toBe("Request URL is missing");
    });
  });

  it("should handle unsupported HTTP method", async () => {
    const { result } = renderHook(() =>
      usePerformFetch("https://example.com", "INVALID_METHOD")
    );

    await act(async () => {
      await result.current.performFetch();
    });

    expect(result.current.error).toBe("Method Not Allowed");
  });

  it("should handle missing headers", async () => {
    const mockData = { data: "test data" };
    axios.mockResolvedValueOnce({ data: mockData });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePerformFetch("https://example.com", "GET")
    );

    await act(async () => {
      await result.current.performFetch(
        "https://example.com",
        "GET",
        null,
        null
      );
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it("should handle empty body for POST request", async () => {
    const mockResponse = { message: "Empty body allowed" };
    axios.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() =>
      usePerformFetch("https://example.com", "INVALID_METHOD")
    );

    await act(async () => {
      await result.current.performFetch("https://example.com", "POST", null);
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle missing URL", async () => {
    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      await result.current.performFetch();
      expect(result.current.error).toBe("Request URL is missing");
    });
  });

  it("should handle invalid URL", async () => {
    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      await result.current.performFetch("invalid-url");
      expect(result.current.error).toBe("Invalid URL");
    });
  });
});
