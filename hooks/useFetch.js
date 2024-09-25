import { useState, useEffect, useRef } from "react";
import { baseApiUrl } from "../component/Shared/SharedUrl";
import { logInfo } from "../util/logging";

const useFetch = (initialRoute, onReceived) => {
  // Validate initial route and arguments
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
  const controllerRef = useRef(null);

  logInfo(`error: ${error}`);
  logInfo(`status: ${isLoading}`);
  logInfo(`data: ${data}`);

  const performFetch = (options = {}, newUrl) => {
    if (newUrl) {
      setRoute(newUrl);
    }
    setError(null);
    setIsLoading(true);

    // Validate URL
    if (!route || !/^\/[a-zA-Z0-9/_-]*$/.test(route)) {
      setError("Invalid URL");
      setIsLoading(false);
      return Promise.reject(new Error("Invalid URL"));
    }

    const baseOptions = {
      method: "GET",
      headers: {
        "content-type": "application/json"
      },
      credentials: "include"
    };

    // Create a new AbortController for each fetch
    const controller = new AbortController();
    controllerRef.current = controller;
    const signal = controller.signal;

    const fetchData = async () => {
      const url = `${baseApiUrl}/api${route}`;
      try {
        const res = await fetch(url, { ...baseOptions, ...options, signal });

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const jsonResult = await res.json();
        setData(jsonResult); // Store the response data

        if (jsonResult.success) {
          onReceived(jsonResult);
        } else {
          setData(jsonResult);
          setError(new Error(jsonResult.msg || "Unexpected error occurred"));
        }
      } catch (error) {
        if (error.name === "AbortError") {
          setError(new Error("Fetch was canceled"));
        } else {
          setError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return Promise.resolve();
  };

  // Cleanup function to abort fetch on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return {
    isLoading,
    error,
    performFetch,
    cancelFetch: () => controllerRef.current?.abort(),
    data
  };
};

export default useFetch;
