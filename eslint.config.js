const { FlatCompat } = require("@eslint/eslintrc");
const eslintPluginReact = require("eslint-plugin-react");
const eslintPluginReactNative = require("eslint-plugin-react-native");
const eslintPluginJsxA11y = require("eslint-plugin-jsx-a11y");
const eslintPluginReactHooks = require("eslint-plugin-react-hooks");

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  ...compat.extends("plugin:react/recommended"),
  {
    ignores: ["**/node_modules/**", "**/.expo/**", "**/dist/**", "**/build/**"]
  },
  {
    plugins: {
      react: eslintPluginReact,
      "react-native": eslintPluginReactNative,
      "jsx-a11y": eslintPluginJsxA11y,
      "react-hooks": eslintPluginReactHooks
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
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
      "react-native/no-inline-styles": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off"
    }
  },
  {
    files: ["**/*.test.js", "**/__tests__/**/*.{js,ts}", "cypress/**/*.js"],
    rules: {
      "no-unused-vars": "off",
      "react/prop-types": "off"
    }
  }
];
