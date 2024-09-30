import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseApiUrl } from "../component/Shared/SharedUrl";
import { logInfo, logError } from "../util/logging";

const useGoogleFetch = onReceived => {
  if (typeof onReceived !== "function") {
    throw new Error("useGoogleFetch: onReceived must be a function");
  }

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const cancelTokenRef = useRef(null);

  const performGoogleFetch = async authentication => {
    setError(null);
    setData(null);
    setIsLoading(true);

    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${authentication.accessToken}`,
        {
          cancelToken: new axios.CancelToken(cancel => {
            cancelTokenRef.current = cancel;
          })
        }
      );

      const { email, name, picture } = res.data;

      const userData = {
        email,
        name,
        token: authentication.idToken,
        platform: getPlatform()
      };

      const serverResponse = await axios.post(
        `${baseApiUrl}/auth/sign-in-with-google`,
        userData,
        {
          cancelToken: new axios.CancelToken(cancel => {
            cancelTokenRef.current = cancel;
          })
        }
      );

      // Verificamos si la respuesta del backend fue exitosa
      if (serverResponse.data && serverResponse.data.success) {
        setData(serverResponse.data);
        onReceived(serverResponse.data);
      } else {
        const errorMsg = serverResponse.data.msg || "Unexpected server error";
        setError(new Error(errorMsg));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        setError(new Error("Google Fetch was canceled"));
      } else {
        const errorMsg =
          error.response?.data?.msg || error.message || "Unexpected error";
        setError(new Error(errorMsg));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current();
      }
    };
  }, []);

  const getPlatform = () => {
    if (Platform.OS === "ios") {
      return "iOS";
    } else if (Platform.OS === "android") {
      return "Android";
    } else {
      return "Web";
    }
  };

  return {
    isLoading,
    error,
    data,
    performGoogleFetch
  };
};

export default useGoogleFetch;
