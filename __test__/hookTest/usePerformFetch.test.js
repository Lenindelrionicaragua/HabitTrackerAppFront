import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import usePerformFetch from "../../hooks/usePerformFetch";

// Mock axios
jest.mock("axios");

describe("usePerformFetch", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid interference
  });

  it("should handle successful GET request", async () => {
    const mockData = { success: true, data: "test data" };
    axios.mockResolvedValueOnce({ data: mockData });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePerformFetch("https://example.com", "GET")
    );

    // Act: perform the fetch
    act(() => {
      result.current.performFetch();
    });

    // Wait for the state to update
    await waitForNextUpdate();

    // Assert: check the states
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

jest.mock("axios");

describe("usePerformFetch Hook", () => {
  beforeEach(() => {
    axios.mockClear();
  });

  it("should handle null request parameters", async () => {
    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      const response = await result.current.performFetch(null);

      // Since response may be undefined, check result.current.error instead
      expect(result.current.error).toBe("Request URL is missing");
    });
  });

  it("should handle unsupported HTTP method", async () => {
    axios.mockRejectedValueOnce(new Error("Method Not Allowed"));

    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      const response = await result.current.performFetch(
        "https://example.com",
        "INVALID_METHOD"
      );
      // Check the state instead of response.error
      expect(result.current.error).toBe("Method Not Allowed");
    });
  });

  it("should handle missing headers", async () => {
    const mockData = { data: "test data" };
    axios.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      await result.current.performFetch(
        "https://example.com",
        "GET",
        null, // no body
        null // no headers
      );

      // Check the result's current state
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle empty body for POST request", async () => {
    const mockResponse = { message: "Empty body allowed" };
    axios.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      await result.current.performFetch(
        "https://example.com",
        "POST",
        null // Empty body
      );

      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle missing URL", async () => {
    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      await result.current.performFetch();
      // Check state for error
      expect(result.current.error).toBe("Request URL is missing");
    });
  });

  it("should handle invalid URL", async () => {
    axios.mockRejectedValueOnce(new Error("Invalid URL"));

    const { result } = renderHook(() => usePerformFetch());

    await act(async () => {
      await result.current.performFetch("invalid-url");
      // Check state for error
      expect(result.current.error).toBe("Invalid URL");
    });
  });
});
