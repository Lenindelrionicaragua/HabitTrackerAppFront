module.exports = {
  collectCoverage: false,
  preset: "jest-expo",
  transformIgnorePatterns: [
    // "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    "node_modules/(?!(jest-)?react-native|react-native|react-redux|@react-native|@react-navigation|@expo|expo|@unimodules|unimodules|sentry-expo|@reduxjs/toolkit|native-base|react-native-svg)"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@env$": "<rootDir>/__mocks__/@env.js"
  },
  watchman: false
};
