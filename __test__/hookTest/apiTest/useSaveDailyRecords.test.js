import { renderHook, act } from "@testing-library/react-hooks";
import useSaveDailyRecords from "../../../hooks/api/useSaveDailyRecords";
import axios from "axios";
import { logError, logInfo } from "../../../util/logging";

// Mocking axios and logging methods
jest.mock("axios");
jest.mock("../../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

describe("useSaveDailyRecords.js Hook", () => {
  const categoryId = "Work";
  const totalMinutes = 30;

  const dataResponse = {
    success: true,
    record: "newRecord"
  };

  const dataResponseFailed = {
    success: false,
    message: "Error saving record."
  };

  beforeEach(() => {
    axios.mockClear();
    logInfo.mockClear();
    logError.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //   it("Should return success when DailyRecord is successfully saved", async () => {
  //     axios.mockImplementationOnce(() =>
  //       Promise.resolve({
  //         data: dataResponse
  //       })
  //     );

  //     const { result } = renderHook(() => useSaveDailyRecords());

  //     await act(async () => {
  //       await result.current.createDailyRecord(categoryId, totalMinutes);
  //     });

  //     expect(result.current.createDailyRecord).toBeTruthy();
  //     expect(result.current.success).toBe(true);
  //     expect(logInfo).toHaveBeenCalledWith("DailyRecord successfully saved.");
  //     expect(logError).not.toHaveBeenCalled();
  //   });

  it("Should call logError when DailyRecord fails to save", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseFailed
      })
    );

    const { result } = renderHook(() => useSaveDailyRecords());

    await act(async () => {
      await result.current.createDailyRecord(categoryId, totalMinutes);
    });

    expect(result.current.success).toBe(false);
    expect(logError).toHaveBeenCalledWith(
      "Failed to save dailyRecord: Error saving record."
    );
    // expect(logInfo).not.toHaveBeenCalled();
  });
});
