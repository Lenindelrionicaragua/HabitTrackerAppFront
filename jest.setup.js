import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import Constants from "expo-constants";

// Mock para AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// Mock para expo-constants
jest.mock("expo-constants", () => {
  const actualConstants = jest.requireActual("expo-constants");
  return {
    ...actualConstants,
    manifest: {
      ...actualConstants.manifest,
      scheme: "zenTimerScheme"
      // Agrega cualquier otra información necesaria en el manifiesto
    }
  };
});

global.__expoConstants = Constants.manifest;
