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
  const [data, setData] = useState(null); // Aquí almacenaremos directamente la respuesta del servidor
  const cancelTokenRef = useRef(null);

  logInfo(`Error recibido: ${error ? error.message : "Sin error"}`);
  logInfo(`Estado de carga: ${isLoading}`);
  logInfo(`Datos recibidos: ${JSON.stringify(data, null, 2)}`); // Usamos JSON.stringify para ver bien la estructura

  const performFetch = (options = {}, newUrl) => {
    if (newUrl) {
      setRoute(newUrl);
    }
    setError(null);
    setIsLoading(true);

    if (!route || !/^\/[a-zA-Z0-9/_-]*$/.test(route)) {
      setError("Invalid URL");
      setIsLoading(false);
      return Promise.reject(new Error("Invalid URL"));
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
      const url = `${baseApiUrl}/api${route}`;
      try {
        const res = await axios(url, baseOptions);

        // Aquí almacenamos directamente la respuesta en `data`
        setData(res.data);

        if (res.data.success) {
          onReceived(res.data); // Llamamos a la función para manejar los datos
        } else {
          setError(new Error(res.data.msg || "Unexpected error occurred"));
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.msg || error.message || "Unexpected error";
        setError(new Error(errorMsg));
        setData({ success: false, msg: errorMsg }); // Guardamos también el mensaje de error en `data`
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
        cancelTokenRef.current();
      }
    };
  }, []);

  return {
    isLoading,
    error,
    performFetch,
    cancelFetch: () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current();
      }
    },
    data // Aquí `data` será la respuesta directa del servidor
  };
};

export default useFetch;
