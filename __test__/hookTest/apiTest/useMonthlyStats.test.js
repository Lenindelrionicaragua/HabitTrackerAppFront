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
  getDaysInMonth: () => 30
}));
jest.mock("../../../util/prepareChartData", () => jest.fn(data => data));

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
        percentage: 87
      },
      {
        name: "Family time",
        dailyGoal: 55,
        totalMinutes: 1,
        percentage: 1
      },
      {
        name: "Exercise",
        dailyGoal: 55,
        totalMinutes: 0,
        percentage: 1
      },
      {
        name: "Screen-free",
        dailyGoal: 55,
        totalMinutes: 2,
        percentage: 3
      },
      {
        name: "Rest",
        dailyGoal: 55,
        totalMinutes: 0,
        percentage: 0
      },
      {
        name: "Study",
        dailyGoal: 55,
        totalMinutes: 5,
        percentage: 8
      }
    ]
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-11-15T12:00:00Z"));

    dispatchMock = jest.fn();

    store = createStore(rootReducer, {
      monthlyStats: {}
    });

    jest
      .spyOn(require("react-redux"), "useDispatch")
      .mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should fetch and process monthly stats data and dispatch it to Redux store", async () => {
    axios.mockResolvedValueOnce({ data: dataResponseWithStats });

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        setMonthlyStats(
          expect.objectContaining({
            success: true,
            totalMinutes: 59,
            dailyAverageMinutes: expect.any(Number),
            categoryData: expect.arrayContaining([
              expect.objectContaining({
                name: "Work",
                monthlyGoal: 55 * 30,
                colors: expect.any(Object)
              })
            ])
          })
        )
      );
    });
  });

  it("should handle errors properly", async () => {
    axios.mockRejectedValueOnce(new Error("Unexpected server error"));

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
    let resolveFetch;
    axios.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolveFetch = () => resolve({ data: dataResponseWithStats });
        })
    );

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    const fetchPromise = act(async () => {
      result.current.fetchMonthlyStats();
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      resolveFetch();
    });

    await fetchPromise;

    expect(result.current.isLoading).toBe(false);
  });
});
