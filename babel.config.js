module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "@babel/preset-react",
      "@babel/preset-typescript"
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env"
        }
      ],
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-export-default-from"
    ],
    transformIgnorePatterns: [
      "node_modules/(?!react-native|react-navigation|d3-shape|react-native-pie-chart)"
    ]
  };
};
