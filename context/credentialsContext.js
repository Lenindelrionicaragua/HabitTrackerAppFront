import { createContext } from "react";
import { logInfo } from "../util/logging";

export const CredentialsContext = createContext({
  storedCredentials: {},
  setStoredCredentials: credentials => {
    logInfo("Stored credentials updated:", credentials);
  }
});
