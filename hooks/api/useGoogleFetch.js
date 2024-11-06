import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseApiUrl } from "../../component/Shared/SharedUrl";
import { Platform } from "react-native";
import { logInfo, logError } from "../../util/logging";

// Custom hook to fetch user data from Google
const useGoogleFetch = onReceived => {
  if (typeof onReceived !== "function") {
    throw new Error("useGoogleFetch: onReceived must be a function");
  }

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const cancelTokenRef = useRef(null); // Store cancel token

  // Gets the current platform (iOS, Android, or Web)
  const getPlatform = () => {
    if (Platform.OS === "ios") {
      return "iOS";
    } else if (Platform.OS === "android") {
      return "Android";
    } else {
      return "Web";
    }
  };

  // Performs the Google fetch operation
  const performGoogleFetch = async authentication => {
    setError(null);
    setData(null);
    setIsLoading(true);

    logInfo("Authentication object received for Google fetch.");

    try {
      // Fetch user info from Google
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${authentication.accessToken}`,
        {
          cancelToken: new axios.CancelToken(cancel => {
            cancelTokenRef.current = cancel; // Store cancel function
          })
        }
      );

      const { email, name, picture } = res.data;
      console.log("Google user data:", { email, name, picture });

      const userData = {
        email,
        name,
        picture,
        token: authentication.idToken || "",
        platform: getPlatform()
      };

      // Authenticate user with backend
      const serverResponse = await axios.post(
        `${baseApiUrl}/api/auth/sign-in-with-google`,
        userData,
        {
          withCredentials: true,
          cancelToken: new axios.CancelToken(cancel => {
            cancelTokenRef.current = cancel; // Store cancel function again
          })
        }
      );

      const { success, msg, user, error: serverError } = serverResponse.data;

      logInfo(`serverResponse: ${JSON.stringify(serverResponse.data)}`);

      if (success) {
        setData(serverResponse.data);
        onReceived(serverResponse.data);
      } else {
        const errorMsg = serverError || msg || "Unexpected server error";
        setError(new Error(errorMsg));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        setError(new Error("Google Fetch was canceled"));
      } else {
        const errorMsg =
          error.response?.data?.msg || error.message || "Unexpected error";
        logError("Fetch error during Google sign-in: " + errorMsg);
        setError(new Error(errorMsg));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current(); // Call cancel function if it exists
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
