const path = require("path");

module.exports = {
  mode: "development", // Modo de desarrollo
  entry: "./App.js", // Archivo de entrada principal de tu aplicación
  output: {
    path: path.resolve(__dirname, "dist"), // Carpeta de salida
    filename: "bundle.js" // Nombre del archivo de salida
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Archivos JavaScript y JSX
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Usa babel-loader para transpilar
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"] // Presets de Babel
          }
        }
      },
      {
        test: /\.css$/, // Archivos CSS
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // Imágenes
        type: "asset/resource"
      }
    ]
  }
};
