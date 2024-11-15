import { useState, useEffect } from "react";
import { logError } from "../util/logging";

export const useHandleError = (error, setSuccess, setErrorMessage) => {
  useEffect(() => {
    if (!error) return;

    setSuccess(false);
    setErrorMessage(error.message || "An unknown error occurred.");
    logError(`Error: ${error.message}`);

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, setSuccess, setErrorMessage]);
};
