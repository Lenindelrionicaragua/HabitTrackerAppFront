import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import Constants from "expo-constants";
import "@testing-library/jest-dom/extend-expect";

// Mock for AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// Mock for expo-constants
jest.mock("expo-constants", () => {
  const actualConstants = jest.requireActual("expo-constants");
  return {
    ...actualConstants,
    manifest: {
      ...actualConstants.manifest,
      scheme: "zenTimerScheme"
    }
  };
});

global.__expoConstants = Constants.manifest;
