import React, { useState, useEffect } from "react";
import RootStack from "./navigators/RootStack";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import store from "./store/store";
// Credentials context
import { CredentialsContext } from "./context/credentialsContext";
import { logError } from "./util/logging";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState(null);

  const checkLoginCredentials = async () => {
    try {
      const result = await AsyncStorage.getItem("zenTimerUser");
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      logError("Error retrieving stored credentials:", error);
    } finally {
      setAppReady(true);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync(); // optional here, but safe
        await checkLoginCredentials();
      } catch (e) {
        logError("Error during app preparation:", e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync(); // <-- Hide splash screen here
      }
    }

    prepare();
  }, []);

  if (!appReady) {
    return null;
  }

  // Uncomment this once you’re ready to show RootStack after splash
  return (
    <Provider store={store}>
      <CredentialsContext.Provider
        value={{ storedCredentials, setStoredCredentials }}>
        <RootStack testID="root-stack" />
      </CredentialsContext.Provider>
    </Provider>
  );
}
