import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "../../../reducers/rootReducer";
import useMonthlyStats from "../../../hooks/api/useMonthlyStats";
import axios from "axios";
import { logError, logInfo } from "../../../util/logging";
import * as roundingUtils from "../../../util/roundingUtils";
import { MonthlyStatsColors } from "../../../styles/AppStyles";

jest.mock("axios");
jest.mock("../../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

const { color1, color2, color3, color4, color5, color6, color7 } =
  MonthlyStatsColors;

describe("useMonthlyStats Hook with Redux", () => {
  let store;

  const storedCredentials = {
    name: "John Doe",
    email: "johndoe@example.com"
  };

  const dataResponseWithMonthlyStats = {
    success: true,
    totalMinutes: 123.456,
    categoryCount: 6,
    daysWithRecords: 5,
    totalDailyMinutes: {
      "2024-11-19": 50.556,
      "2024-11-20": 72.349
    },
    categoryData: [
      { name: "Work", totalMinutes: 120.123, percentage: 40.123 },
      { name: "Family time", totalMinutes: 60.789, percentage: 20.456 },
      { name: "Exercise", totalMinutes: 50.456, percentage: 16.789 },
      { name: "Screen-free", totalMinutes: 40.001, percentage: 13.333 },
      { name: "Rest", totalMinutes: 10.555, percentage: 3.333 },
      { name: "Study", totalMinutes: 5.999, percentage: 1.999 }
    ]
  };

  const roundedDataResponse = {
    success: true,
    totalMinutes: 123.46,
    categoryCount: 6,
    daysWithRecords: 5,
    totalDailyMinutes: {
      "2024-11-19": 50.56,
      "2024-11-20": 72.35
    },
    categoryData: [
      { name: "Work", totalMinutes: 120.12, percentage: 40.12 },
      { name: "Family time", totalMinutes: 60.79, percentage: 20.46 },
      { name: "Exercise", totalMinutes: 50.46, percentage: 16.79 },
      { name: "Screen-free", totalMinutes: 40.0, percentage: 13.33 },
      { name: "Rest", totalMinutes: 10.56, percentage: 3.33 },
      { name: "Study", totalMinutes: 6.0, percentage: 2.0 }
    ]
  };

  beforeEach(() => {
    axios.mockClear();
    logInfo.mockClear();
    logError.mockClear();

    store = createStore(rootReducer, {});

    jest
      .spyOn(roundingUtils, "roundAllValues")
      .mockImplementation(() => roundedDataResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should fetch and store monthly stats data when success is true", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithMonthlyStats
      })
    );

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    const state = store.getState().monthlyStats;

    expect(roundingUtils.roundAllValues).toHaveBeenCalledWith(
      dataResponseWithMonthlyStats,
      0
    );
    expect(state.totalMinutes).toBe(123.46);
    expect(state.categoryCount).toBe(6);
    expect(state.daysWithRecords).toBe(5);
    expect(state.categoryData[0].totalMinutes).toBe(120.12);
  });

  it("Should handle errors and not update the store", async () => {
    const errorResponse = { message: "Authentication required." };
    axios.mockImplementationOnce(() =>
      Promise.reject({
        response: { data: errorResponse }
      })
    );

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    expect(result.current.success).toBe(false);
    expect(result.current.errorMessage).toBe("Authentication required.");
    expect(logError).toHaveBeenCalledWith(
      "Error fetching monthly stats: Authentication required."
    );

    const state = store.getState().monthlyStats;
    expect(state.totalMinutes).toBe(0); // Initial state remains
  });

  it("Should calculate series and sliceColors correctly", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithMonthlyStats
      })
    );

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    const expectedSeries = [120.12, 60.79, 50.46, 40.0, 10.56, 6.0];
    const expectedSliceColors = [
      color1,
      color2,
      color3,
      color4,
      color5,
      color6
    ];

    expect(result.current.series).toEqual(expectedSeries);
    expect(result.current.sliceColors).toEqual(expectedSliceColors);
  });
});
