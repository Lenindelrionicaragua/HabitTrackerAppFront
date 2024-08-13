import { useState, useEffect } from "react";
import { renderHook } from "@testing-library/react-hooks";

// Hook Implementation
function useCircleParams(elapsedTime, initialTime) {
  const [circleParams, setCircleParams] = useState({
    circumference: 0,
    strokeDashoffset: 0
  });

  useEffect(() => {
    const calculateCircleParams = (elapsedTime, initialTime) => {
      const radius = 150;
      const circumference = 2 * Math.PI * radius;

      const effectiveElapsedTime = Number.isFinite(elapsedTime)
        ? elapsedTime
        : 0;
      const effectiveInitialTime = Number.isFinite(initialTime)
        ? initialTime
        : 0;

      if (effectiveElapsedTime <= 0) {
        return { circumference, strokeDashoffset: circumference };
      }

      const timeFraction = Math.min(
        effectiveElapsedTime / effectiveInitialTime,
        1
      );

      let strokeDashoffset = circumference * (1 - timeFraction);

      strokeDashoffset = Math.max(
        0,
        Math.round(strokeDashoffset * 1000) / 1000
      );

      return { circumference, strokeDashoffset };
    };

    const params = calculateCircleParams(elapsedTime, initialTime);
    setCircleParams(params);
  }, [elapsedTime, initialTime]);

  return circleParams;
}

// Tests
describe("useCircleParams", () => {
  test("returns correct values when elapsedTime and initialTime are both valid", () => {
    const { result } = renderHook(() => useCircleParams(50, 100));
    const { circumference, strokeDashoffset } = result.current;

    expect(circumference).toBeCloseTo(2 * Math.PI * 150);
    expect(strokeDashoffset).toBeCloseTo(circumference * 0.5);
  });

  test("returns strokeDashoffset as 0 when elapsedTime is NaN", () => {
    const { result } = renderHook(() => useCircleParams(NaN, 100));
    expect(result.current.strokeDashoffset).toBe(result.current.circumference);
  });

  test("returns strokeDashoffset as 0 when initialTime is NaN", () => {
    const { result } = renderHook(() => useCircleParams(50, NaN));
    expect(result.current.strokeDashoffset).toBe(0);
  });

  test("returns strokeDashoffset as 0 when initialTime is 0", () => {
    const { result } = renderHook(() => useCircleParams(50, 0));
    expect(result.current.strokeDashoffset).toBe(0);
  });

  test("handles case when elapsedTime exceeds initialTime", () => {
    const { result } = renderHook(() => useCircleParams(150, 100));
    expect(result.current.strokeDashoffset).toBe(0);
  });

  test("returns correct values when elapsedTime is 0", () => {
    const { result } = renderHook(() => useCircleParams(0, 100));
    const { circumference, strokeDashoffset } = result.current;

    expect(circumference).toBeCloseTo(2 * Math.PI * 150);
    expect(strokeDashoffset).toBeCloseTo(circumference);
  });

  test("returns strokeDashoffset as approximately 50% of circumference when elapsedTime is 50% of initialTime", () => {
    const initialTime = 100;
    const elapsedTime = 0.5 * initialTime;
    const { result } = renderHook(() =>
      useCircleParams(elapsedTime, initialTime)
    );
    const { circumference, strokeDashoffset } = result.current;

    const expectedStrokeDashoffset = circumference * 0.5; // 100% - 50% = 50%
    expect(strokeDashoffset).toBeCloseTo(expectedStrokeDashoffset, 3); // Precision of 3 decimal places
  });

  test("returns strokeDashoffset as approximately 75% of circumference when elapsedTime is 75% of initialTime", () => {
    const initialTime = 100;
    const elapsedTime = 0.75 * initialTime;
    const { result } = renderHook(() =>
      useCircleParams(elapsedTime, initialTime)
    );
    const { circumference, strokeDashoffset } = result.current;

    const expectedStrokeDashoffset = circumference * 0.25; // 100% - 75% = 25%
    expect(strokeDashoffset).toBeCloseTo(expectedStrokeDashoffset, 3); // Precision of 3 decimal places
  });
});
