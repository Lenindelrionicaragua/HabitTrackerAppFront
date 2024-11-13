import { renderHook, act } from "@testing-library/react-hooks";
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

  const dateResponseWithError = {
    success: false,
    error: "User ID is required."
  };

  beforeEach(() => {
    axios.mockClear();
    logInfo.mockClear();
    logError.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log success message when categories are created successfully", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponse
      })
    );

    const { result } = renderHook(() => useCreateDefaultCategories());

    await act(async () => {
      await result.current();
    });

    expect(logInfo).toHaveBeenCalledWith(
      "Categories successfully auto-created."
    );
    expect(result.current).toBeTruthy();
  });
});
