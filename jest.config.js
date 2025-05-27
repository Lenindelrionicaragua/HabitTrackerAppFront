module.exports = {
  collectCoverage: false,
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|react-native|react-redux|@react-native|@react-navigation|@expo|expo|@unimodules|unimodules|sentry-expo|@reduxjs/toolkit|native-base|react-native-svg)"
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@env$": "<rootDir>/__mocks__/@env.js"
  },
  testTimeout: 30000,
  maxWorkers: "50%",
  watchman: false
};
