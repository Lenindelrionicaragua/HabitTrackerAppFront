import { renderHook, act } from "@testing-library/react-hooks";
import useStopwatchLogicMock from "../../__mocks__/useStopwatchLogicMock";

describe("useStopwatch", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("should decrease the time accurately and consistently", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(40);
    expect(result.current.elapsedTime).toBe(10);

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    expect(result.current.remainingTime).toBe(0);
    expect(result.current.elapsedTime).toBe(50);
    expect(result.current.timeCompleted).toBe(true);

    expect(clearInterval).toHaveBeenCalled();
  });

  it("should pause the stopwatch correctly", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      result.current.pauseStopwatch();
    });

    expect(result.current.running).toBe(false);

    const elapsedTimeAfterPause = result.current.elapsedTime;
    const remainingTimeAfterPause = result.current.remainingTime;

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.elapsedTime).toBe(elapsedTimeAfterPause);
    expect(result.current.remainingTime).toBe(remainingTimeAfterPause);

    expect(clearInterval).toHaveBeenCalledTimes(1);
  });

  it("should resume the stopwatch correctly", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      result.current.pauseStopwatch();
    });

    act(() => {
      result.current.resumeStopwatch();
    });

    expect(result.current.running).toBe(true);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.remainingTime).toBe(30);
    expect(result.current.elapsedTime).toBe(20);
  });

  it("should set timeCompleted to true when the initial time is completed", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(initialTime * 1000);
    });

    expect(result.current.running).toBe(false);
    expect(result.current.timeCompleted).toBe(true);
    expect(result.current.remainingTime).toBe(0);
    expect(result.current.elapsedTime).toBe(initialTime);
  });

  it("should handle multiple resume and pause calls correctly", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchLogicMock());

    // Iniciar el cronómetro
    act(() => {
      result.current.startTimer(initialTime);
    });

    // Simular múltiples pausas y reanudaciones en un corto período de tiempo
    act(() => {
      for (let i = 0; i < 5; i++) {
        jest.advanceTimersByTime(100); // Simular 100ms de avance
        result.current.pauseStopwatch(); // Pausar cronómetro
        jest.advanceTimersByTime(100); // Simular 100ms de pausa
        result.current.resumeStopwatch(); // Reanudar cronómetro
      }
    });

    // Verificar que el cronómetro siga corriendo
    expect(result.current.running).toBe(true);

    // Verificar que el tiempo transcurrido no se haya acumulado incorrectamente
    expect(result.current.elapsedTime).toBeLessThan(1); // Debería ser cercano a 0

    // Comprobar que el tiempo restante sea cercano al valor inicial
    expect(result.current.remainingTime).toBeCloseTo(initialTime, 1); // Debería ser cercano a 50
  });
});
