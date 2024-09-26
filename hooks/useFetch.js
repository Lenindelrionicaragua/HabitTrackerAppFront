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
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  const cancelTokenRef = useRef(null);

  logInfo(`Error msg from the server: ${error ? error.message : "not error"}`);
  logInfo(`State of loading: ${isLoading}`);
  logInfo(`Success: ${success}`);
  logInfo(`Message: ${message}`);
  logInfo(`User: ${user}`);

  const performFetch = (options = {}, newUrl) => {
    if (newUrl) {
      setRoute(newUrl);
    }
    setError(null);
    setMessage(null);
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
          const { success, msg, user, error: serverError } = response.data;

          setSuccess(success);
          setUser(user);

          // Establecer mensaje dependiendo del éxito
          if (success) {
            setMessage(msg); // Mensaje de éxito
          } else {
            const errorMsg = serverError || msg || "Unexpected server error";
            setError(new Error(errorMsg));
            setMessage(errorMsg); // Mensaje de error
            throw new Error(errorMsg);
          }

          onReceived(response.data);
        } else {
          throw new Error("Empty response from server");
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          setError(new Error("Fetch was canceled")); // Mensaje de cancelación
        } else {
          const errorMsg =
            error.response?.data?.msg || error.message || "Unexpected error";
          setError(new Error(errorMsg));
          setMessage(errorMsg); // Mensaje de error
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
        cancelTokenRef.current("Fetch was canceled"); // Envía el mensaje de cancelación
      }
    };
  }, []);

  return {
    isLoading,
    error,
    success,
    user,
    message,
    performFetch,
    cancelFetch: () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current();
      }
    }
  };
};

export default useFetch;
