module.exports = {
  preset: "jest-expo",
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.setup.js"
  ],
  transformIgnorePatterns: [
    // "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    "node_modules/(?!(react-redux|@reduxjs/toolkit|@react-native/.*|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@react-native/js-polyfills/.*))"
  ],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@env$": "<rootDir>/__mocks__/@env.js"
  }
};
