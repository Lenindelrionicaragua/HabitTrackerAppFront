import { createContext } from "react";
import { logInfo } from "../util/logging";

export const CredentialsContext = createContext({
  storedCredentials: {},
  setStoredCredentials: () => {}
});
