// @ts-check
const federationConfig = require("./config/federation").config
const createSearchIndexPlugin = require("./plugins/cms-content-plugin")

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
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-yaml`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-decap-cms`,
      options: {
        htmlTitle: `Network360 CMS`,
      },
    },
    `cms-content-plugin`,
    // TODO: this probably isn't legal, but you'll never catch me alive, coppah!
    createSearchIndexPlugin(),
  ],
}

module.exports = config
