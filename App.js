import React, { useState, useEffect } from "react";
import { logError } from "./util/logging";
import RootStack from "./navigators/RootStack";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Credentials context
import { CredentialsContext } from "./context/credentialsContext";

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = async () => {
    try {
      const result = await AsyncStorage.getItem("zenTimerCredentials");
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      logError(error);
    } finally {
      setAppReady(true);
    }
  };

  useEffect(() => {
    checkLoginCredentials();
  }, []);

  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={logError}
      />
    );
  }

  return (
    <CredentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials }}
    >
      <RootStack testID="root-stack" />
    </CredentialsContext.Provider>
  );
}
