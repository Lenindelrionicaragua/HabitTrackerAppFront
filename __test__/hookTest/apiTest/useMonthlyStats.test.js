import { renderHook, act } from "@testing-library/react-hooks";
import useMonthlyStats from "../../../hooks/api/useMonthlyStats";
import axios from "axios";
import { logError, logInfo } from "../../../util/logging";
import * as roundingUtils from "../../../util/roundingUtils"; // Import for mocking
import { MonthlyStatsColors } from "../../../styles/AppStyles";

jest.mock("axios");
jest.mock("../../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

const { color1, color2, color3, color4, color5, color6, color7 } =
  MonthlyStatsColors;

describe("useMonthlyStats Hook", () => {
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

  const dateResponseWithError = {
    success: false,
    message: "Error fetching categories: BAD REQUEST: Authentication required."
  };

  beforeEach(() => {
    axios.mockClear();
    logInfo.mockClear();
    logError.mockClear();
    jest
      .spyOn(roundingUtils, "roundAllValues")
      .mockImplementation(() => roundedDataResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should fetch and round monthly stats data when success is true", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithMonthlyStats
      })
    );

    roundingUtils.roundAllValues.mockImplementationOnce(
      () => roundedDataResponse
    );

    const { result } = renderHook(() => useMonthlyStats());

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    expect(roundingUtils.roundAllValues).toHaveBeenCalledWith(
      dataResponseWithMonthlyStats,
      0
    );
    expect(result.current.success).toBe(true);
    expect(result.current.message).toBe("Monthly stats fetched successfully.");
    expect(result.current.totalMinutes).toBe(123.46);
    expect(result.current.dailyAverageMinutes).toBe(61.46);
    expect(result.current.categoryData[0].totalMinutes).toBe(120.12);
  });

  it("Should call roundAllValues utility with the correct data", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithMonthlyStats
      })
    );

    const { result } = renderHook(() => useMonthlyStats());

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    expect(roundingUtils.roundAllValues).toHaveBeenCalledTimes(1);
    expect(roundingUtils.roundAllValues).toHaveBeenCalledWith(
      dataResponseWithMonthlyStats,
      0
    );
  });

  it("Should return an error when API call fails", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dateResponseWithError
      })
    );

    const { result } = renderHook(() => useMonthlyStats());

    await act(async () => {
      await result.current.fetchMonthlyStats();
    });

    expect(result.current.success).toBe(false);
    expect(result.current.errorMessage).toBe(
      "Error fetching categories: BAD REQUEST: Authentication required."
    );
    expect(result.current.message).toBe("");
    expect(logError).toHaveBeenCalledWith(
      "Error fetching monthly stats: Error fetching categories: BAD REQUEST: Authentication required."
    );
  });

  it("Should return an object with the expected structure", () => {
    const { result } = renderHook(() => useMonthlyStats());

    expect(result.current).toHaveProperty("totalMinutes");
    expect(result.current).toHaveProperty("categoryCount");
    expect(result.current).toHaveProperty("daysWithRecords");
    expect(result.current).toHaveProperty("dailyAverageMinutes");
    expect(result.current).toHaveProperty("categoryData");
    expect(result.current).toHaveProperty("series");
    expect(result.current).toHaveProperty("sliceColors");
    expect(result.current).toHaveProperty("success");
    expect(result.current).toHaveProperty("errorMessage");
    expect(result.current).toHaveProperty("message");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("fetchMonthlyStats");
    expect(result.current).toHaveProperty("cancelFetch");
  });

  it("Should correctly calculate series and sliceColors based on categoryData", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseWithMonthlyStats
      })
    );

    const { result } = renderHook(() => useMonthlyStats());

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
