// @ts-check
const federationConfig = require("./config/federation").config;
const createSearchIndexPlugin = require("./plugins/cms-content-plugin");

/** @satisfies {import('gatsby').GatsbyConfig} */
const config = {
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
        publicPath: "/",
      },
    },
    `cms-content-plugin`,
    // TODO: this probably isn't legal, but you'll never catch me alive, coppah!
    createSearchIndexPlugin(),
  ],
};

module.exports = config;
