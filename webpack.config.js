const path = require("path")

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib"),
    library: "reactMultistore",
    libraryTarget: "umd",
    globalObject: "this",
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React",
    },
  },
  module: {
    rules: [{ test: /\.js$/, loader: "babel-loader" }],
  },
}
