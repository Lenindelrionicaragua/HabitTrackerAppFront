const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  root: true,
  extends: ["@react-native-community", "plugin:react-hooks/recommended"],
  plugins: ["react", "react-native", "jsx-a11y", "react-hooks", "cypress"],
  env: {
    browser: true,
    es2021: true,
    "cypress/globals": true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/prop-types": "warn",
    "no-unused-vars": ["warn", { varsIgnorePattern: "^React$" }],
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "error",
    "no-console": ["error", { allow: ["warn", "error"] }],
    "react-native/no-unused-styles": "warn",
    "react-native/no-inline-styles": "warn",
    "react-native/no-color-literals": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
});
