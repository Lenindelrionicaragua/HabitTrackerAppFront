import React, { useState, useEffect } from "react";
import { logError } from "./util/logging";
import RootStack from "./navigators/RootStack";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
// credentials context
import { CredentialsContext } from "./context/credentialsContext";

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = () => {
    AsyncStorage.getItem("zenTimerCredentials")
      .then(result => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
        setAppReady(true);
      })
      .catch(error => logError(error));
  };

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
