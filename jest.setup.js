import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import Constants from "expo-constants";
import { Alert } from "react-native";

jest.spyOn(Alert, "alert").mockImplementation(() => {});
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

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
