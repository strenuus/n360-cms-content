// @ts-check
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const { ModuleFederationPlugin } = require("webpack").container
const federation = require("./federation")

/** @typedef {import("webpack").Configuration} Configuration */
/** @satisfies {Configuration} */
const config = {
  mode: "development",
  entry: {},
  output: {
    path: path.resolve(__dirname, "./public"),
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".wasm"],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new ModuleFederationPlugin({
      ...federation.config,
    }),
  ],
  devServer: {
    proxy: [
      {
        context: ["/packs/"],
        target: "http://network360-webpacker-1:3035",
      },
    ]
  },
}

module.exports = config
