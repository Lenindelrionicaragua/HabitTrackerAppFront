import { useState, useEffect, useCallback } from "react";
import { logError } from "../util/logging";

export const useHandleError = (error, setSuccess, setErrorMessage) => {
  const [hasHandledError, setHasHandledError] = useState(false);

  useEffect(() => {
    if (!error || hasHandledError) return;

    setSuccess(false);
    setErrorMessage(error.message || "An unknown error occurred.");
    logError(`Error: ${error.message}`);

    setHasHandledError(true);

    const timer = setTimeout(() => {
      setErrorMessage("");
      setHasHandledError(false);
    }, 3000);

    return () => clearTimeout();
  }, [error, setSuccess, setErrorMessage, hasHandledError]);

  const resetErrorState = useCallback(() => {
    if (hasHandledError) {
      setHasHandledError(false);
      setSuccess(null);
      setErrorMessage("");
    }
  }, [hasHandledError, setSuccess, setErrorMessage]);

  return { resetErrorState };
};
