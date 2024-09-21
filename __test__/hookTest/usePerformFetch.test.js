import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import usePerformFetch from "../../hooks/usePerformFetch";

// Mock axios
jest.mock("axios");

describe("usePerformFetch hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle a successful GET request", async () => {
    // Mock axios response for GET
    const mockData = {
      data: { success: true, message: "Data fetched successfully" }
    };
    axios.get.mockResolvedValueOnce(mockData);

    // Use the hook
    const { result, waitForNextUpdate } = renderHook(() => usePerformFetch());

    // Trigger the performFetch function (GET request)
    act(() => {
      result.current.performFetch("/api/test-endpoint", "GET");
    });

    // Wait for the state to update after the fetch
    await waitForNextUpdate();

    // Assertions
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.data).toEqual(mockData.data);
    expect(result.current.error).toBe(null);
  });

  it("should handle a failed GET request", async () => {
    // Mock axios response for GET failure
    const mockError = { message: "Network Error" };
    axios.get.mockRejectedValueOnce(mockError);

    // Use the hook
    const { result, waitForNextUpdate } = renderHook(() => usePerformFetch());

    // Trigger the performFetch function (GET request)
    act(() => {
      result.current.performFetch("/api/test-endpoint", "GET");
    });

    // Wait for the state to update after the fetch
    await waitForNextUpdate();

    // Assertions
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("Network Error");
  });

  it("should handle a successful POST request", async () => {
    // Mock axios response for POST
    const mockPostData = {
      data: { success: true, message: "Data saved successfully" }
    };
    axios.post.mockResolvedValueOnce(mockPostData);

    // Use the hook
    const { result, waitForNextUpdate } = renderHook(() => usePerformFetch());

    // Trigger the performFetch function (POST request)
    act(() => {
      result.current.performFetch("/api/test-endpoint", "POST", {
        name: "John"
      });
    });

    // Wait for the state to update after the fetch
    await waitForNextUpdate();

    // Assertions
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.data).toEqual(mockPostData.data);
    expect(result.current.error).toBe(null);
  });

  it("should handle a failed POST request", async () => {
    // Mock axios response for POST failure
    const mockError = { message: "Failed to save data" };
    axios.post.mockRejectedValueOnce(mockError);

    // Use the hook
    const { result, waitForNextUpdate } = renderHook(() => usePerformFetch());

    // Trigger the performFetch function (POST request)
    act(() => {
      result.current.performFetch("/api/test-endpoint", "POST", {
        name: "John"
      });
    });

    // Wait for the state to update after the fetch
    await waitForNextUpdate();

    // Assertions
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("Failed to save data");
  });
});
