import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseApiUrl } from "../component/Shared/SharedUrl";
import { logInfo } from "../util/logging";

const useFetch = (initialRoute, onReceived) => {
  if (!initialRoute || initialRoute.includes("api/")) {
    throw new Error("Invalid route provided");
  }

  if (typeof initialRoute !== "string") {
    throw new Error("useFetch: route must be a string");
  }

  if (typeof onReceived !== "function") {
    throw new Error("useFetch: onReceived must be a function");
  }

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState(initialRoute);
  const [data, setData] = useState(null);

  const cancelTokenRef = useRef(null);

  logInfo(`Error msg from the server: ${error ? error.message : "not error"}`);
  logInfo(`State of loading: ${isLoading}`);
  logInfo(`Data: ${JSON.stringify(data)}`);

  const performFetch = (options = {}, newUrl) => {
    if (newUrl) {
      setRoute(newUrl);
    }
    setError(null);
    setData(null);
    setIsLoading(true);

    if (!route || !/^\/[a-zA-Z0-9/_-]*$/.test(route)) {
      setError(new Error("Invalid URL"));
      setIsLoading(false);
      return;
    }

    const baseOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true,
      cancelToken: new axios.CancelToken(cancel => {
        cancelTokenRef.current = cancel;
      }),
      ...options
    };

    const fetchData = async () => {
      try {
        const url = `${baseApiUrl}/api${route}`;
        const response = await axios(url, baseOptions);

        if (response && response.data) {
          setData(response.data);

          const { success, msg, user, error: serverError } = response.data;

          if (success) {
            onReceived(response.data);
          } else {
            const errorMsg = serverError || msg || "Unexpected server error";
            setError(new Error(errorMsg));
            throw new Error(errorMsg);
          }
        } else {
          throw new Error("Empty response from server");
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          setError(new Error("Fetch was canceled"));
        } else {
          const errorMsg =
            error.response?.data?.msg || error.message || "Unexpected error";
          setError(new Error(errorMsg));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return Promise.resolve();
  };

  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current("Fetch was canceled");
      }
    };
  }, []);

  return {
    isLoading,
    error,
    data,
    performFetch,
    cancelFetch: () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current();
      }
    }
  };
};

export default useFetch;
