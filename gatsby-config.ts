import { GatsbyConfig } from "gatsby";
import { config as federationConfig } from "./config/federation";
import elasticlunrConfig from "./src/gatsby-config/elasticlunr-config";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Network360 CMS`,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-federation",
      options: {
        ssr: false,
        federationConfig,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-plugin-decap-cms`,
      options: {
        htmlTitle: `Network360 CMS`,
        publicPath: "..",
      },
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: elasticlunrConfig,
    },
  ],
};

export default config;
