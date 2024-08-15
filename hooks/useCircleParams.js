import { useState, useEffect } from "react";

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

export default useCircleParams;
