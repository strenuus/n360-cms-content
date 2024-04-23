import { config as federationConfig } from "./config/federation";
import { container } from "webpack";
import {
  CreateWebpackConfigArgs,
  CreateNodeArgs,
  CreateSchemaCustomizationArgs,
} from "gatsby";
import createGraphqlTypes from "./src/gatsby-node/createGraphqlTypes";
import exportStaticJsonFiles from "./src/gatsby-node/exportStaticJsonFiles";
import createIndexableNodes from "./src/gatsby-node/createIndexableNodes";

export function onCreateWebpackConfig({
  stage,
  actions: { setWebpackConfig },
}: CreateWebpackConfigArgs) {
  if (stage === "build-html" || stage === "develop-html") {
    setWebpackConfig({
      plugins: [new container.ModuleFederationPlugin(federationConfig)],
    });
  }
}

export function createSchemaCustomization(args: CreateSchemaCustomizationArgs) {
  createGraphqlTypes(args);
}

export function onCreateNode(args: CreateNodeArgs) {
  createIndexableNodes(args);
}

export function onPostBuild() {
  exportStaticJsonFiles();
}
