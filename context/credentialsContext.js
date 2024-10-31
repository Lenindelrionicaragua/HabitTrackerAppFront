import { createContext, useState } from "react";
import { logInfo } from "../util/logging";

export const CredentialsContext = createContext();

export const CredentialsProvider = ({ children }) => {
  const [storedCredentials, setStoredCredentials] = useState({});

  const updateCredentials = credentials => {
    setStoredCredentials(credentials);
  };

  return (
    <CredentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials: updateCredentials }}
    >
      {children}
    </CredentialsContext.Provider>
  );
};
