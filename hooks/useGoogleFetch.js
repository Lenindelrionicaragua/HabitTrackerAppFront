import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseApiUrl } from "../component/Shared/SharedUrl";
import { Platform } from "react-native";

// Custom hook to fetch user data from Google
const useGoogleFetch = onReceived => {
  if (typeof onReceived !== "function") {
    throw new Error("useGoogleFetch: onReceived must be a function");
  }

  const [error, setError] = useState(null); // Holds error messages
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [data, setData] = useState(null); // Fetched data
  const cancelTokenRef = useRef(null); // For request cancellation

  // Gets the current platform (iOS, Android, or Web)
  const getPlatform = () => {
    if (Platform.OS === "ios") return "iOS";
    if (Platform.OS === "android") return "Android";
    return "Web";
  };

  // Performs the Google fetch operation
  const performGoogleFetch = async authentication => {
    setError(null);
    setData(null);
    setIsLoading(true); // Start loading

    try {
      // Fetch user info from Google
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
        platform: getPlatform() // Store the platform
      };

      // Authenticate user with backend
      const serverResponse = await axios.post(
        `${baseApiUrl}/api/auth/sign-in-with-google`,
        userData,
        {
          cancelToken: new axios.CancelToken(cancel => {
            cancelTokenRef.current = cancel;
          })
        }
      );

      // Check server response
      if (serverResponse.data && serverResponse.data.success) {
        setData(serverResponse.data);
        onReceived(serverResponse.data); // Handle received data
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
      setIsLoading(false); // End loading
    }
  };

  // Cleanup on unmount
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
    data,
    performGoogleFetch
  };
};

export default useGoogleFetch;
