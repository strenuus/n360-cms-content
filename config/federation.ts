import { dependencies as deps } from "../package.json";
import { ModuleFederationPluginOptions } from "@module-federation/typescript/src/types";

export const hostUrl = new URL(
  "/host-container/packs/remoteEntry.js",
  process.env.URL || "http://localhost:8080"
);

export const config: ModuleFederationPluginOptions = {
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

const federation = {
  config,
  hostUrl,
};

export default federation;
