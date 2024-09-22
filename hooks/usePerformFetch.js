import { useState } from "react";
import axios from "axios";

const usePerformFetch = (
  initialUrl = "",
  initialMethod = "GET",
  initialBody = null,
  initialHeaders = null
) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const performFetch = async (
    url = initialUrl,
    method = initialMethod,
    body = initialBody,
    headers = initialHeaders
  ) => {
    if (!url) {
      setError("Request URL is missing");
      setLoading(false);
      setSuccess(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url,
        method,
        data: body,
        headers: headers || { "Content-Type": "application/json" }
      });

      setData(response.data);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Unknown error occurred");
      setData(null);
      setSuccess(false);
      setLoading(false);
    }
  };

  return { data, error, loading, success, performFetch };
};

export default usePerformFetch;
