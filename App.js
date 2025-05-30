import React, { useState, useEffect } from "react";
import RootStack from "./navigators/RootStack";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import store from "./store/store";
import { CredentialsContext } from "./context/credentialsContext";
import { logError } from "./util/logging";
import FirstTimeWelcomeScreen from "./screens/FirstTimeWelcomeScreen/FirstTimeWelcomeScreen.js"; // <-- New

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  const checkAppState = async () => {
    try {
      const result = await AsyncStorage.getItem("zenTimerUser");
      const firstLaunchFlag = await AsyncStorage.getItem("hasLaunched");

      if (firstLaunchFlag === null) {
        setIsFirstLaunch(true);
      }

      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      logError("Error checking app state:", error);
    } finally {
      setAppReady(true);
    }
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasLaunched", "true");
    setIsFirstLaunch(false);
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await checkAppState();
      } catch (e) {
        logError("Error during app preparation:", e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <CredentialsContext.Provider
        value={{ storedCredentials, setStoredCredentials }}>
        {isFirstLaunch ? (
          <FirstTimeWelcomeScreen onGetStarted={handleGetStarted} />
        ) : (
          <RootStack testID="root-stack" />
        )}
      </CredentialsContext.Provider>
    </Provider>
  );
}
