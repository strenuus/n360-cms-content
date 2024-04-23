import { container, Configuration } from "webpack";
import "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import federation from "./federation";

const config: Configuration = {
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
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/cms/cms.html",
      filename: "index.html",
      chunks: ["main"],
    }),
    new container.ModuleFederationPlugin({
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

export default config;
