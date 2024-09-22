import { useState, useEffect } from "react";
import axios from "axios";

const usePerformFetch = (url, method = "GET", body = null, headers = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const performFetch = async () => {
    if (!url) {
      setError("Request URL is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url,
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        data: body
      });

      setData(response.data);
      setSuccess(true);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, success, performFetch };
};

export default usePerformFetch;
