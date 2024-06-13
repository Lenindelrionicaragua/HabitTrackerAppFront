const { getDefaultConfig } = require("expo/metro-config");
const nodeLibs = require("node-libs-browser");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  ...nodeLibs,
  stream: require.resolve("stream-browserify"),
  vm: require.resolve("vm-browserify"),
  crypto: require.resolve("crypto-browserify")
};

module.exports = defaultConfig;
