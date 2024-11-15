import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/rootReducer";
import useSaveDailyRecords from "../../hooks/api/useSaveDailyRecords";
import axios from "axios";
import { logError, logInfo } from "../../util/logging";

// Mocking axios and logging methods
jest.mock("axios");
jest.mock("../../util/logging", () => ({
  logInfo: jest.fn(),
  logError: jest.fn()
}));

const store = createStore(rootReducer);

const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

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
    jest.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });
    expect(result.current.success).toBe(null);
    expect(result.current.errorMessage).toBe("");
    expect(result.current.message).toBe("");
  });

  it("Should return success when DailyRecord is successfully saved", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponse
      })
    );

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    await act(async () => {
      await result.current.createDailyRecord(categoryId, totalMinutes);
    });

    // Verifica que los resultados sean correctos
    expect(result.current.success).toBe(true);
    expect(result.current.message).toBe("DailyRecord successfully saved.");
    expect(logInfo).toHaveBeenCalledWith("DailyRecord successfully saved.");
    expect(logError).not.toHaveBeenCalled();
  });

  it("Should call logError when DailyRecord fails to save", async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({
        data: dataResponseFailed
      })
    );

    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });

    await act(async () => {
      await result.current.createDailyRecord(categoryId, totalMinutes);
    });

    // Verifica que el estado y los logs sean correctos en caso de error
    expect(result.current.success).toBe(false);
    expect(result.current.errorMessage).toBe("Error saving record.");
    expect(logError).toHaveBeenCalledWith("Error: Error saving record.");
  });

  it("Should handle axios error correctly", async () => {
    const errorMessage = "Network Error";
    axios.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useSaveDailyRecords(categoryId), {
      wrapper
    });

    await act(async () => {
      await result.current.createDailyRecord(totalMinutes);
    });

    // Verifica el comportamiento ante un error de red
    expect(result.current.success).toBe(false);
    expect(result.current.errorMessage).toBe("Network Error");
    expect(logError).toHaveBeenCalledWith("Error: Network Error");
  });

  it("Should clear error message after 3 seconds", async () => {
    const { result } = renderHook(() => useSaveDailyRecords(), { wrapper });
    // Simulamos un error
    act(() => {
      result.current.setErrorMessage("Temporary error");
      result.current.setSuccess(false);
    });

    // Verifica que el mensaje de error se limpie después de 3 segundos
    expect(result.current.errorMessage).toBe("Temporary error");
    await act(async () => {
      // Esperamos 3 segundos para que se limpie el mensaje de error
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.errorMessage).toBe(""); // El mensaje debería estar vacío después de 3 segundos
  });
});
