import { useState } from "react";
import axios from "axios";

const usePerformFetch = (
  initialUrl = "",
  initialMethod = "GET",
  initialBody = null,
  initialHeaders = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch request
  const performFetch = async (
    url = initialUrl,
    method = initialMethod,
    body = initialBody,
    headers = initialHeaders
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers: {
          "Content-Type": "application/json",
          ...headers
        }
      });

      // Ensure data exists in the response before setting it
      if (response && response.data) {
        setData(response.data);
        setSuccess(true);
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      // Check for a properly structured error response
      const errorMessage =
        error.response?.data?.msg || error.message || "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, success, performFetch };
};

export default usePerformFetch;
