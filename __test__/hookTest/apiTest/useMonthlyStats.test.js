import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { render, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
// import { createContext } from "react";
// import rootReducer from "../../../reducers/rootReducer";
import useMonthlyStats from "../../../hooks/api/useMonthlyStats";
import axios from "axios";
import { logError, logInfo } from "../../../util/logging";

jest.mock("axios");
jest.mock("../../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

describe("useMonthlyStats Hook", () => {
  const dataResponseWithMonthlyStats = {
    success: true,
    totalMinutes: 0,
    categoryCount: 0,
    daysWithRecords: 0,
    totalDailyMinutes: 0,
    categoryData: [
      { name: "Work", totalMinutes: 120, percentage: 0 },
      { name: "Family time", totalMinutes: 60, percentage: 0 },
      { name: "Exercise", totalMinutes: 50, percentage: 0 },
      { name: "Screen-free", totalMinutes: 40, percentage: 0 },
      { name: "Rest", totalMinutes: 0, percentage: 0 },
      { name: "Study", totalMinutes: 0, percentage: 0 }
    ]
  };

  const dateResponseWithError = {
    success: false,
    message: "Error fetching categories: BAD REQUEST: Authentication required."
  };

  beforeEach(() => {
    axios.mockClear();
    logInfo.mockClear();
    logError.mockClear;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should fetch and log monthly stats data when success is true", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithMonthlyStats
      })
    );

    const { result } = renderHook(() => useMonthlyStats());

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    expect(logInfo).toHaveBeenCalledWith(
      dataResponseWithMonthlyStats.categoryData
    );
  });

  it("Should return an error when API call fall ", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dateResponseWithError
      })
    );

    const { result } = renderHook(() => useMonthlyStats());

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error.message).toContain("Unexpected server error");
  });

  it("Should return an object with the expected structure", () => {
    const { result } = renderHook(() => useMonthlyStats());

    expect(result.current).toHaveProperty("totalMinutes");
    expect(result.current).toHaveProperty("categoryCount");
    expect(result.current).toHaveProperty("daysWithRecords");
    expect(result.current).toHaveProperty("totalDailyMinutes");
    expect(result.current).toHaveProperty("categoryData");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("fetchMonthlyStats");
    expect(result.current).toHaveProperty("cancelFetch");
  });
});
