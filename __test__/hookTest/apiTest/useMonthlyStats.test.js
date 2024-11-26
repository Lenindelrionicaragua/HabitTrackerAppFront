import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../../reducers/rootReducer";
import useMonthlyStats from "../../../hooks/api/useMonthlyStats";
import axios from "axios";
import { setMonthlyStats } from "../../../actions/counterActions";
import { logError, logInfo } from "../../../util/logging";

jest.mock("axios");
jest.mock("../../../util/logging");

describe("useMonthlyStats Hook with Redux", () => {
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
      { name: "Work", totalMinutes: 52, percentage: 87 },
      { name: "Family time", totalMinutes: 1, percentage: 1 },
      { name: "Exercise", totalMinutes: 0, percentage: 1 },
      { name: "Screen-free", totalMinutes: 2, percentage: 3 },
      { name: "Rest", totalMinutes: 0, percentage: 0 },
      { name: "Study", totalMinutes: 5, percentage: 8 }
    ],
    series: [52, 1, 0, 2, 0, 5],
    sliceColors: [
      "#fb105b",
      "#ff6543",
      "#ad2bd5",
      "#ff9c97",
      "#ffe181",
      "#554865"
    ],
    dailyAverageMinutes: 19.67
  };

  const dataResponseWithError = {
    success: false,
    message: "Unexpected server error"
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

  it("should fetch and store monthly stats data when success is true", async () => {
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
      expect(dispatchMock).toHaveBeenCalledWith(
        setMonthlyStats({
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
            { name: "Work", totalMinutes: 52, percentage: 87 },
            { name: "Family time", totalMinutes: 1, percentage: 1 },
            { name: "Exercise", totalMinutes: 0, percentage: 1 },
            { name: "Screen-free", totalMinutes: 2, percentage: 3 },
            { name: "Rest", totalMinutes: 0, percentage: 0 },
            { name: "Study", totalMinutes: 5, percentage: 8 }
          ],
          series: [52, 1, 0, 2, 0, 5],
          sliceColors: [
            "#fb105b",
            "#ff6543",
            "#ad2bd5",
            "#ff9c97",
            "#ffe181",
            "#554865"
          ],
          dailyAverageMinutes: 19.67
        })
      );
    });
  });

  it("should handle errors and not update the store", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithError
      })
    );

    const { result } = renderHook(() => useMonthlyStats(storedCredentials), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
    });

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    await waitFor(() => {
      expect(result.current.success).toBe(false);
      expect(result.current.errorMessage).toBe("Unexpected server error");
    });

    expect(logError).toHaveBeenCalledWith(
      "Error fetching monthly stats: Unexpected server error"
    );
  });

  it("should calculate series and sliceColors correctly", async () => {
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
      expect(result.current.series).toEqual([52, 1, 0, 2, 0, 5]);
      expect(result.current.sliceColors).toEqual([
        "#fb105b",
        "#ff6543",
        "#ad2bd5",
        "#ff9c97",
        "#ffe181",
        "#554865"
      ]);
    });
  });

  it("should dispatch the correct data to Redux store", async () => {
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
      expect(dispatchMock).toHaveBeenCalledWith(
        setMonthlyStats({
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
            { name: "Work", totalMinutes: 52, percentage: 87 },
            { name: "Family time", totalMinutes: 1, percentage: 1 },
            { name: "Exercise", totalMinutes: 0, percentage: 1 },
            { name: "Screen-free", totalMinutes: 2, percentage: 3 },
            { name: "Rest", totalMinutes: 0, percentage: 0 },
            { name: "Study", totalMinutes: 5, percentage: 8 }
          ],
          series: [52, 1, 0, 2, 0, 5],
          sliceColors: [
            "#fb105b",
            "#ff6543",
            "#ad2bd5",
            "#ff9c97",
            "#ffe181",
            "#554865"
          ],
          dailyAverageMinutes: 19.67
        })
      );
    });
  });
});
