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

      // Set response data to state
      setData(response.data);
      setSuccess(true);
      return response.data;
    } catch (error) {
      // Handle errors with axios
      const errorMessage =
        error.response?.data?.msg || error.message || "An error occurred";
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Return values for components to use
  return { data, loading, error, success, performFetch };
};

export default usePerformFetch;
