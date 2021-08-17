const path = require("path")

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "index.js"),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname),
  },
  module: {
    rules: [{ test: /\.js$/, loader: "babel-loader" }],
  },
  devServer: {
    host: "0.0.0.0",
    port: 9000,
    contentBase: path.resolve(__dirname),
    compress: true,
    hot: true,
  },
}
