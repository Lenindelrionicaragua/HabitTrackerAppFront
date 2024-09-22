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
