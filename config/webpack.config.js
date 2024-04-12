// @ts-check
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const federation = require("./federation");

/** @typedef {import("webpack").Configuration} Configuration */
/** @satisfies {Configuration} */
const config = {
  mode: "development",
  entry: {
    main: "./src/cms/main-entry.ts",
    preview: "./src/cms/preview-entry.ts",
  },
  output: {
    path: path.resolve(__dirname, "./../public"),
    filename: "[name]_bundle.js",
    crossOriginLoading: "anonymous",
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
    new HtmlWebpackPlugin({
      template: "src/cms/cms.html",
      filename: "index.html",
      chunks: ["main"],
    }),
    new ModuleFederationPlugin({
      ...federation.config,
    }),
  ],
  devServer: {
    proxy: [
      {
        context: "/cms/",
        target: "http://n360-cms-content-web-1:8080",
        pathRewrite: { "^/cms/": "/" },
      },
      {
        context: "/host-container/",
        target: "http://network360-webpacker-1:3035",
        pathRewrite: { "^/host-container/": "/" },
      },
      {
        context: ["/packs/", "/federation/", "/assets/"],
        target: "http://network360-webpacker-1:3035",
      },
    ],
  },
};

module.exports = config;
