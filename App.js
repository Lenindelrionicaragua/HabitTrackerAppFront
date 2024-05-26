import React, { useState, useEffect } from "react";
import { logError } from "./util/logging";
import RootStack from "./navigators/RootStack";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Credentials context
import { CredentialsContext } from "./context/credentialsContext";

SplashScreen.preventAutoHideAsync();

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
      SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    checkLoginCredentials();
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <CredentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials }}
    >
      <RootStack testID="root-stack" />
    </CredentialsContext.Provider>
  );
}
