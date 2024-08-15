import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import Constants from "expo-constants";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

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
