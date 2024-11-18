import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../../reducers/rootReducer";
import useSaveDailyRecords from "../../../hooks/api/useSaveDailyRecords";
import axios from "axios";
import { logError, logInfo } from "../../../util/logging";

// Mock axios and logging methods
jest.mock("axios");
jest.mock("../../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

const store = createStore(rootReducer);
const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

describe("useSaveDailyRecords.js Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return true and log success when the record is saved successfully", async () => {
    axios.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.createDailyRecord();
    });

    expect(response).toBe(true);
    expect(logInfo).toHaveBeenCalledWith("DailyRecord successfully saved.");
    expect(logError).not.toHaveBeenCalled();
  });

  it("Should return false and log an error when the record save fails", async () => {
    axios.mockResolvedValueOnce({ data: { success: false } });

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.createDailyRecord();
    });

    expect(response).toBe(false);
    expect(logError).toHaveBeenCalledWith("Failed to save the record.");
    expect(logInfo).not.toHaveBeenCalled();
  });

  it("Should handle and log axios errors correctly", async () => {
    axios.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.createDailyRecord();
    });

    expect(response).toEqual({ success: false, error: expect.any(Error) });
    expect(logError).toHaveBeenCalledWith("Failed to save the record.");
    expect(logInfo).not.toHaveBeenCalled();
  });
});
