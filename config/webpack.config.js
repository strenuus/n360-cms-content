// @ts-check
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const { ModuleFederationPlugin } = require("webpack").container
const federationConfig = require("./federation")

/** @typedef {import("webpack").Configuration} Configuration */
/** @satisfies {Configuration} */
const config = {
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
      ...federationConfig,
      exposes: {
        "./PageData": "./public/page-data/hello-world/page-data.json",
        "./Entry": "./src/entry.tsx",
      },
    }),
  ],
}

module.exports = config
