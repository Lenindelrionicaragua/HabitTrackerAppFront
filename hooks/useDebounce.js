import { useRef } from "react";

const useDebounce = (func, delay) => {
  const timeoutRef = useRef(null);

  const debouncedFunc = (...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  };

  return debouncedFunc;
};

export default useDebounce;
