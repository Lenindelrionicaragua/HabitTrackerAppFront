const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./index.web.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      "react-native$": "react-native-web"
    },
    extensions: [".web.js", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["module:metro-react-native-babel-preset"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true)
    })
  ]
};
