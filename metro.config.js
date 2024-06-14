const { getDefaultConfig } = require("expo/metro-config");
const nodeLibs = require("node-libs-browser");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  defaultConfig.resolver.extraNodeModules = {
    ...nodeLibs,
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"),
    crypto: require.resolve("crypto-browserify")
  };

  return defaultConfig;
})();
