import { useState } from "react";
import { baseApiUrl } from "../component/Shared/SharedUrl";

const useFetch = (initialRoute, onReceived) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const cancelFetch = () => {
    controller.abort();
  };

  if (!initialRoute || initialRoute.includes("api/")) {
    throw new Error("Invalid route provided");
  }

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState(initialRoute);

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
      return;
    }

    const baseOptions = {
      method: "GET",
      headers: {
        "content-type": "application/json"
      },
      credentials: "include"
    };

    const fetchData = async () => {
      const url = `${baseApiUrl}/api${route}`;
      try {
        const res = await fetch(url, { ...baseOptions, ...options, signal });

        if (!res.ok) {
          setError(`Error: ${res.status} ${res.statusText}`);
          setIsLoading(false);
          return;
        }

        const jsonResult = await res.json();

        if (jsonResult.success) {
          onReceived(jsonResult);
        } else {
          setError(jsonResult.msg || "Unexpected error occurred");
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
  };

  return { isLoading, error, performFetch, cancelFetch };
};

export default useFetch;
