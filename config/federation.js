// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { dependencies: deps } = require("../package.json")

const hostUrl = new URL(
  "packs/remoteEntry.js",
  process.env.HOST_CONTAINER_URL || "http://network360-webpacker-1:3035"
)

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
    marked: { eager: true },
    "html-react-parser": { eager: true },
  },
}

module.exports = config
