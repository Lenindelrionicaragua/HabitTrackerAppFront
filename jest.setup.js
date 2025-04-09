import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import Constants from "expo-constants";

// Mock de AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// Mock de Expo Constants
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

afterEach(() => {
  jest.restoreAllMocks();
});

global.__expoConstants = Constants.manifest;

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
