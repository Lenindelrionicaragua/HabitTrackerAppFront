module.exports = function (api) {
  api.cache(true);

  const babelConfig = {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env"
        }
      ],
      [
        "module-resolver",
        {
          alias: {
            components: "./src/components",
            screens: "./src/screens",
            "react-native-device-info$": "./mock/DeviceInfoMock" // Alias para DeviceInfoMock
          },
          extensions: [".ios.js", ".android.js", ".js", ".json"]
        }
      ],
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-export-default-from"
    ]
  };

  if (!config.isEjected) {
    babelConfig.plugins[0][1].alias["react-native-device-info$"] =
      "./mock/DeviceInfoMock";
  }

  return babelConfig;
};
