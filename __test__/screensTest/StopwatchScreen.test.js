import { useState, useRef } from "react";
import { renderHook, act } from "@testing-library/react-hooks";

const setCircleColor = jest.fn();

function useStopwatchScreen() {
  const [initialTime, setInitialTime] = useState(0); // tiempo del usuario
  const [remainingTime, setRemainingTime] = useState(0); // cuanto tiempo le queda al timer para terminar
  const [elapsedTime, setElapsedTime] = useState(0); // tiempo transcurrido en el timer
  const [timeCompleted, setTimeCompleted] = useState(false);

  const intervalRef = useRef(null); // definido a 1 segundo
  const startTimeRef = useRef(0); // tiempo cuando se inicializo el timer

  const startTimer = initialTime => {
    setCircleColor("skyBlue");
    startTimeRef.current = Date.now(); // ponemos el tiempo de inicializado como ahora

    intervalRef.current = setInterval(() => {
      const now = Date.now(); // actualizacion constante del nuevo ahora cada 1 segundo
      const elapsedTime = Math.floor((now - startTimeRef.current) / 1000); // al tiempo actual le restamos el tiempo de inicio
      const newRemainingTime = Math.max(0, initialTime - elapsedTime); // cuanto le queda al tiempo que mide el usuario

      setRemainingTime(newRemainingTime); // actualizar el tiempo que falta

      if (newRemainingTime === 0) {
        // si no falta mas tiempo, guardamos datos y paramos el timer.
        clearInterval(intervalRef.current);
        setTimeCompleted(true);
      }

      setElapsedTime(elapsedTime);
    }, 1000);
  };

  return {
    remainingTime,
    elapsedTime,
    timeCompleted,
    startTimer
  };
}

export default useStopwatchScreen;

describe("useStopwatchScreen", () => {
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
    const { result } = renderHook(() => useStopwatchScreen());

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

  it("should start and stop de elapsedTime when de interval is clear", () => {
    const initialTime = 50;
    const { result } = renderHook(() => useStopwatchScreen());

    const { result } = renderHook(() => startStopwatch());

    act(() => {
      result.current.startTimer(initialTime);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.currentTime).toBe(40);
    expect(result.current.elapsedTime).toBe(10);

    act(() => {
      jest.advanceTimersByTime(40000);
    });

    expect(result.current.currentTime).toBe(0);
    expect(result.current.elapsedTime).toBe(50);
    expect(result.current.timeCompleted).toBe(true);

    expect(clearInterval).toHaveBeenCalled();
  });
});
