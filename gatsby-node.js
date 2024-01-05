// @ts-check

const { ModuleFederationPlugin } = require("webpack").container
const { createFilePath } = require(`gatsby-source-filesystem`)
const federationConfig = require("./config/federation")

/** @param {import("gatsby").CreateWebpackConfigArgs} args */
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  const { setWebpackConfig } = actions
  if (stage === "build-html" || stage === "develop-html") {
    setWebpackConfig({
      plugins: [new ModuleFederationPlugin(federationConfig)],
    })
  }
}

/** @param {import("gatsby").CreateNodeArgs} args */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

/** @param {import("gatsby").CreateSchemaCustomizationArgs} args */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
