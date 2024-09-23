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
  const [route, setRoute] = useState(initialRoute); // Maintain the initial route

  const performFetch = (options = {}, newUrl) => {
    if (newUrl) {
      setRoute(newUrl); // Update the route if a new URL is provided
    }
    setError(null);
    setIsLoading(true);

    const baseOptions = {
      method: "GET",
      headers: {
        "content-type": "application/json"
      },
      credentials: "include"
    };

    const fetchData = async () => {
      const url = `${baseApiUrl}/api${route}`;
      const res = await fetch(url, { ...baseOptions, ...options, signal });

      if (!res.ok) {
        setError(`Error: ${res.status} ${res.statusText}`);
        setIsLoading(false);
        return; // Early return on error
      }

      const jsonResult = await res.json();

      if (jsonResult.success) {
        onReceived(jsonResult);
      } else {
        setError(jsonResult.msg || "Unexpected error occurred");
      }

      setIsLoading(false);
    };

    fetchData().catch(error => {
      if (error.name === "AbortError") {
        setError(new Error("Fetch was canceled"));
      } else {
        setError(error);
      }
      setIsLoading(false);
    });
  };

  return { isLoading, error, performFetch, cancelFetch };
};

export default useFetch;
