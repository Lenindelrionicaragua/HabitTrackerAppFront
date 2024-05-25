import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import Constants from "expo-constants";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("expo-constants", () => {
  return {
    ...jest.requireActual("expo-constants"),
    manifest: {
      ...jest.requireActual("expo-constants").manifest,
      extra: {
        // Agrega cualquier otro campo que necesites aquí
      }
    }
  };
});

global.__expoConstants = Constants.manifest;
