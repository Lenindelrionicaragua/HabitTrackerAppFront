import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseApiUrl } from "../../component/Shared/SharedUrl";
import { logInfo, logError } from "../../util/logging";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const performFetch = async (options = {}, newUrl) => {
    if (newUrl) {
      cancelFetch();
      setRoute(newUrl);
    }

    setError(null);
    setData(null);
    setIsLoading(true);

    if (!route || !/^\/[a-zA-Z0-9/_-]*(\?[a-zA-Z0-9=&]*)?$/.test(route)) {
      if (isMounted.current) {
        setError(new Error("Invalid URL"));
        setIsLoading(false);
      }
      return;
    }

    let token = null;
    try {
      token = await AsyncStorage.getItem("zenTimerToken");
    } catch (error) {
      logError("Failed to retrieve token", error);
    }

    abortControllerRef.current = new AbortController();

    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      signal: abortControllerRef.current.signal,
      withCredentials: true,
      ...options
    };

    try {
      const url = `${baseApiUrl}/api${route}`;
      const response = await axios(url, fetchOptions);

      logInfo(`Request URL: ${url}`);

      if (!response || !response.data) {
        throw new Error("Unexpected server error");
      }

      if (Object.keys(response.data).length === 0) {
        throw new Error("Empty response from server");
      }

      const { success, msg, message, error: serverError } = response.data;

      if (success) {
        if (isMounted.current) {
          setData(response.data);
          onReceived(response.data);
        }
      } else {
        throw new Error(
          serverError || msg || message || "Unexpected server error"
        );
      }
    } catch (error) {
      if (isMounted.current) {
        const errorMsg =
          error.name === "CanceledError"
            ? "Fetch was canceled"
            : error.response?.data?.msg || error.message || "Unexpected error";
        setError(new Error(errorMsg));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const cancelFetch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return {
    isLoading,
    error,
    data,
    performFetch,
    cancelFetch
  };
};

export default useFetch;
