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
        // Decap CMS uses this path for two purposes, and uses it inconsistently:
        // 1. It will place build artifacts in `public/${publicPath}`.
        // 2. After a user logs in, it will navigate to `/${publicPath}/` (note the surrounding /'s).
        // Setting `publicPath` to an empty string is what we want (so that CMS artifacts go in the root path).
        // However, this causes Decap to try navigating to `//` (not a valid URL) which displays a big red
        // error message and leaves the user on the login screen. Setting it to "<anything>/.."
        // is functionally equivalent to the empty string and gets around the valid-URL problem.
        publicPath: "_/..",
      },
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: elasticlunrConfig,
    },
  ],
};

export default config;
