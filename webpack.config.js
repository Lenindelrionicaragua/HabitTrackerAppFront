const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Puedes personalizar la configuración aquí
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify")
  };

  // Personalización adicional si es necesaria
  config.module.rules.push({
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: "asset/resource"
  });

  return config;
};
