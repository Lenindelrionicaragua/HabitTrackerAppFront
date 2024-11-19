import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../../reducers/rootReducer";
import useSaveDailyRecords from "../../../hooks/api/useSaveDailyRecords";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logError, logInfo } from "../../../util/logging";

jest.mock("axios");
jest.mock("@react-native-async-storage/async-storage");
jest.mock("../../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

const store = createStore(rootReducer);
const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe("useSaveDailyRecords Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle successful record creation", async () => {
    AsyncStorage.getItem.mockResolvedValue("mockedToken");
    axios.post.mockResolvedValue({
      data: { success: true, msg: "Record saved successfully" }
    });

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    await act(async () => {
      const response = await result.current.createDailyRecord();
      expect(response).toEqual({
        success: true,
        data: { success: true, msg: "Record saved successfully" }
      });
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(logInfo).toHaveBeenCalledWith(
      expect.stringContaining("Request made to /time-records/")
    );
  });

  it("should handle failed record creation with server error", async () => {
    const mockErrorResponse = {
      response: { data: { success: false, msg: "Error saving record." } }
    };

    AsyncStorage.getItem.mockResolvedValue("mockedToken");
    axios.post.mockRejectedValue(mockErrorResponse);

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    await act(async () => {
      const response = await result.current.createDailyRecord();
      expect(response).toEqual({ success: false, error: expect.any(Error) });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Error saving record.");
    expect(result.current.isLoading).toBe(false);
    expect(logError).toHaveBeenCalledWith(
      "Failed to save the record",
      expect.any(Error)
    );
  });

  it("should handle network errors", async () => {
    AsyncStorage.getItem.mockResolvedValue("mockedToken");
    axios.post.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    await act(async () => {
      const response = await result.current.createDailyRecord();
      expect(response).toEqual({ success: false, error: expect.any(Error) });
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe("Network Error");
    expect(result.current.isLoading).toBe(false);
    expect(logError).toHaveBeenCalledWith(
      "Failed to save the record",
      expect.any(Error)
    );
  });

  it("should handle missing token gracefully", async () => {
    AsyncStorage.getItem.mockRejectedValue(new Error("Token not found"));
    axios.post.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    await act(async () => {
      const response = await result.current.createDailyRecord();
      expect(response).toEqual({ success: true, data: { success: true } });
    });

    expect(logError).toHaveBeenCalledWith(
      "Failed to retrieve token",
      expect.any(Error)
    );
    expect(axios.post).toHaveBeenCalled();
  });

  it("should set isLoading to true during the request", async () => {
    axios.post.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ data: { success: true } }), 100)
        )
    );

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    act(() => {
      result.current.createDailyRecord();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      await result.current.createDailyRecord();
    });

    expect(result.current.isLoading).toBe(false);
  });
});
