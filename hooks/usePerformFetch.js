import { useState } from "react";
import axios from "axios";

const usePerformFetch = (url, method = "GET", body = null, headers = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const performFetch = async () => {
    if (!url) {
      setError("Request URL is missing");
      return;
    }

    if (!/^https?:\/\/.+/.test(url)) {
      setError("Invalid URL");
      return;
    }

    const validMethods = ["GET", "POST", "PUT", "DELETE"];
    if (!validMethods.includes(method)) {
      setError("Method Not Allowed");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url,
        data: body === null ? undefined : body,
        headers
      });
      setData(response.data);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, success, performFetch };
};

export default usePerformFetch;
