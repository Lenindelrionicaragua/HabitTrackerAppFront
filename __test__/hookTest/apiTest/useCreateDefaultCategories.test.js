import { renderHook, act } from "@testing-library/react-native";
import useCreateDefaultCategories from "../../../hooks/api/useCreateDefaultCategories";
import axios from "axios";
import { logError, logInfo } from "../../../util/logging";

// Mocking axios and logging methods
jest.mock("axios");
jest.mock("../../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

describe("useCreateDefaultCategories Hook", () => {
  const dataResponse = {
    success: true,
    message: "Categories created successfully."
  };

  const dataResponseFailed = {
    success: false,
    message: "Failed to create categories."
  };

  beforeEach(() => {
    axios.mockClear();
    logInfo.mockClear();
    logError.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useCreateDefaultCategories());
    expect(result.current.success).toBe(null);
    expect(result.current.message).toBe("");
  });

  it("should log success message when categories are created successfully", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponse
      })
    );

    const { result } = renderHook(() => useCreateDefaultCategories());

    await act(async () => {
      await result.current.createCategories();
    });

    expect(logInfo).toHaveBeenCalledWith(
      "Categories successfully auto-created."
    );
    expect(result.current.success).toBe(true);
    expect(result.current.message).toBe(
      "Categories successfully auto-created."
    );
  });

  it("should log error message when categories creation fails", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseFailed
      })
    );

    const { result } = renderHook(() => useCreateDefaultCategories());

    await act(async () => {
      await result.current.createCategories();
    });

    expect(logError).toHaveBeenCalledWith(
      "Error: Failed to create categories."
    );
    expect(result.current.success).toBe(false);
    expect(result.current.message).toBe("Error: Failed to create categories.");
  });

  it("should handle axios error correctly", async () => {
    const errorMessage = "Network Error";
    axios.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCreateDefaultCategories());

    await act(async () => {
      await result.current.createCategories();
    });

    expect(result.current.success).toBe(false);
    expect(result.current.message).toBe(`Error: ${errorMessage}`);
    expect(logError).toHaveBeenCalledWith("Error: Network Error");
  });
});
