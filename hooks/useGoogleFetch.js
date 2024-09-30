import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseApiUrl } from "../component/Shared/SharedUrl";
import { logInfo, logError } from "../util/logging";

const useGoogleFetch = onReceived => {
  if (typeof onReceived !== "function") {
    throw new Error("useGoogleFetch: onReceived must be a function");
  }

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const cancelTokenRef = useRef(null);

  const performGoogleFetch = async userData => {
    setError(null);
    setData(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseApiUrl}/auth/sign-in-with-google`,
        userData,
        {
          cancelToken: new axios.CancelToken(cancel => {
            cancelTokenRef.current = cancel;
          })
        }
      );

      if (response.data && response.data.success) {
        onReceived(response.data);
        setData(response.data);
      } else {
        const errorMsg = response.data.msg || "Unexpected server error";
        setError(new Error(errorMsg));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        setError(new Error("Google Fetch was canceled"));
      } else {
        const errorMsg =
          error.response?.data?.msg || error.message || "Unexpected error";
        setError(new Error(errorMsg));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current();
      }
    };
  }, []);

  return {
    isLoading,
    error,
    data,
    performGoogleFetch
  };
};

export default useGoogleFetch;
