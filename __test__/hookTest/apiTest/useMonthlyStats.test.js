// __test__/hookTest/apiTest/useMonthlyStats.test.js

import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../../reducers/rootReducer";
import useMonthlyStats from "../../../hooks/api/useMonthlyStats";
import axios from "axios";
import { setMonthlyStats } from "../../../actions/counterActions";

jest.mock("axios");
jest.mock("../../../util/logging");
jest.mock("../../../util/roundingUtils", () => ({
  ...jest.requireActual("../../../util/roundingUtils"),
  getDaysInMonth: () => 30 // Match the logic used in the hook
}));

describe("useMonthlyStats Hook - Success Case", () => {
  let store;
  let dispatchMock;

  const storedCredentials = {
    name: "John Doe",
    email: "johndoe@example.com"
  };

  const dataResponseWithStats = {
    success: true,
    totalMinutes: 59,
    categoryCount: 5,
    daysWithRecords: 3,
    totalDailyMinutes: {
      "2024-11-23": 51,
      "2024-11-24": 6,
      "2024-11-26": 2
    },
    categoryData: [
      {
        name: "Work",
        dailyGoal: 55,
        totalMinutes: 52,
        percentage: 87,
        monthlyGoal: 1705,
        colors: { primary: "#fb105b", secondary: "#ffa3b0" }
      },
      {
        name: "Family time",
        dailyGoal: 55,
        totalMinutes: 1,
        percentage: 1,
        monthlyGoal: 1705,
        colors: { primary: "#ff6543", secondary: "#ffb59f" }
      },
      {
        name: "Exercise",
        dailyGoal: 55,
        totalMinutes: 0,
        percentage: 1,
        monthlyGoal: 1705,
        colors: { primary: "#ad2bd5", secondary: "#d7b8e9" }
      },
      {
        name: "Screen-free",
        dailyGoal: 55,
        totalMinutes: 2,
        percentage: 3,
        monthlyGoal: 1705,
        colors: { primary: "#16A085", secondary: "#DAF7A6" }
      },
      {
        name: "Rest",
        dailyGoal: 55,
        totalMinutes: 0,
        percentage: 0,
        monthlyGoal: 1705,
        colors: { primary: "#ffe181", secondary: "#fff4cc" }
      },
      {
        name: "Study",
        dailyGoal: 55,
        totalMinutes: 5,
        percentage: 8,
        monthlyGoal: 1705,
        colors: { primary: "#554865", secondary: "#857891" }
      }
    ],
    dailyAverageMinutes: 19.67
  };

  beforeEach(() => {
    dispatchMock = jest.fn();

    store = createStore(rootReducer, {
      monthlyStats: {}
    });

    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and process monthly stats data and dispatch it to Redux store", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithStats
      })
    );

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    await waitFor(() => {
      const expectedProcessedData = {
        success: true,
        totalMinutes: 59,
        categoryCount: 5,
        daysWithRecords: 3,
        totalDailyMinutes: {
          "2024-11-23": 51,
          "2024-11-24": 6,
          "2024-11-26": 2
        },
        categoryData: [
          {
            name: "Work",
            totalMinutes: 52,
            percentage: 87,
            monthlyGoal: 55 * 31,
            colors: { primary: "#fb105b", secondary: "#ffa3b0" },
            dailyGoal: 55
          },
          {
            name: "Family time",
            totalMinutes: 1,
            percentage: 1,
            monthlyGoal: 55 * 31,
            colors: { primary: "#ff6543", secondary: "#ffb59f" },
            dailyGoal: 55
          },
          {
            name: "Exercise",
            totalMinutes: 0.01,
            percentage: 1,
            monthlyGoal: 55 * 31,
            colors: { primary: "#ad2bd5", secondary: "#d7b8e9" },
            dailyGoal: 55
          },
          {
            name: "Screen-free",
            totalMinutes: 2,
            percentage: 3,
            monthlyGoal: 55 * 31,
            colors: { primary: "#16A085", secondary: "#DAF7A6" },
            dailyGoal: 55
          },
          {
            name: "Rest",
            totalMinutes: 0.01,
            percentage: 0.01,
            monthlyGoal: 55 * 31,
            colors: { primary: "#ffe181", secondary: "#fff4cc" },
            dailyGoal: 55
          },
          {
            name: "Study",
            totalMinutes: 5,
            percentage: 8,
            monthlyGoal: 55 * 31,
            colors: { primary: "#554865", secondary: "#857891" },
            dailyGoal: 55
          }
        ],
        dailyAverageMinutes: 19.67
      };

      expect(dispatchMock).toHaveBeenCalledWith(
        setMonthlyStats(expectedProcessedData)
      );
    });
  });

  it("should handle errors properly", async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject(new Error("Unexpected server error"))
    );

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("Unexpected server error");
      expect(result.current.success).toBe(false);
    });
  });

  it("should not fetch data if no credentials are provided", async () => {
    const { result } = renderHook(() => useMonthlyStats(null), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should set loading state correctly while fetching", async () => {
    axios.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ data: dataResponseWithStats }), 1000)
        )
    );

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    expect(result.current.isLoading).toBe(false);
  });
});
