// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { dependencies: deps } = require("../package.json");

const hostUrl = new URL(
  "/host-container/packs/remoteEntry.js",
  process.env.URL || "http://localhost:8080"
);

module.exports.hostUrl = hostUrl;

/** @satisfies {import("@module-federation/typescript/src/types").ModuleFederationPluginOptions} */
const config = {
  name: "cms",
  filename: "remoteEntry.js",
  remotes: {
    host: `host@${hostUrl}`,
  },
  shared: {
    ...deps,
    react: { singleton: true, requiredVersion: deps.react },
    "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
  },
};

module.exports.config = config;
