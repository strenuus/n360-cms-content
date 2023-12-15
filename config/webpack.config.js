const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const { ModuleFederationPlugin } = require("webpack").container
const federationConfig = require("./federation")

/** @typedef {import("webpack").Configuration} Configuration */
/** @satisfies {Configuration} */
module.exports = {
  entry: {},
  output: {
    path: path.resolve(__dirname, "./public"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new ModuleFederationPlugin({
      ...federationConfig,
      exposes: {
        "./Entry": "./public/page-data/hello-world/page-data.json",
      },
    }),
  ],
}
