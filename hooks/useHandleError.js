import { useState, useEffect } from "react";
import { logError } from "../util/logging";

export const useHandleError = error => {
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!error) return;

    setSuccess(false);
    setErrorMessage(error.message || "An unknown error occurred.");
    logError(`Error: ${error.message}`);

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  return { success, errorMessage };
};
