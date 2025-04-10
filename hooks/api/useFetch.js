import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseApiUrl } from "../../component/Shared/SharedUrl";
import { logInfo, logError } from "../../util/logging";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useFetch = (initialRoute, onReceived) => {
  // Validate initial inputs
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

  const performFetch = async (options = {}, newUrl) => {
    if (newUrl) {
      cancelFetch();
      setRoute(newUrl);
    }
    setError(null);
    setData(null);
    setIsLoading(true);

    // Validate the route format
    if (!route || !/^\/[a-zA-Z0-9/_-]*(\?[a-zA-Z0-9=&]*)?$/.test(route)) {
      setError(new Error("Invalid URL"));
      setIsLoading(false);
      return;
    }

    // Retrieve the token from AsyncStorage
    let token = null;
    try {
      token = await AsyncStorage.getItem("zenTimerToken");
    } catch (error) {
      logError("Failed to retrieve token", error);
    }

    const baseOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
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

        logInfo(`Request URL: ${url}`);
        // Check if response and response.data are valid
        if (!response || !response.data) {
          setError(new Error("Unexpected server error"));
          return;
        }

        // Check if response.data is empty
        if (Object.keys(response.data).length === 0) {
          setError(new Error("Empty response from server"));
          return;
        }

        const { success, msg, message, error: serverError } = response.data;

        logInfo(`Response Data: ${JSON.stringify(response.data, null, 2)}`);

        if (success) {
          setData(response.data);
          onReceived(response.data);
        } else {
          const errorMsg =
            serverError || msg || message || "Unexpected server error";
          setError(new Error(errorMsg));
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
