// @ts-check

const path = require(`path`)
const { ModuleFederationPlugin } = require("webpack").container
const { createFilePath } = require(`gatsby-source-filesystem`)
const federationConfig = require("./config/federation")

/** @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']} */
exports.onCreateWebpackConfig = async ({ stage, actions }) => {
  const { setWebpackConfig } = actions
  if (stage === "build-html" || stage === "develop-html") {
    setWebpackConfig({
      plugins: [new ModuleFederationPlugin(federationConfig)],
    })
  }
}

/** @type {import('gatsby').GatsbyNode['createPages']} */
exports.createPages = async ({ graphql: gql, actions, reporter }) => {
  const { createPage } = actions
  // NOTE: This is a hack to get IDE syntax highlighting on gatsby's GQL function
  /** @type {(parts: TemplateStringsArray) => Promise<{ data?: any; errors?: Error[] }>} */
  const graphql = ([query]) => gql(query)

  await createFaq()

  async function createFaq() {
    const noop = path.resolve(`./src/templates/noop.tsx`)

    const faq = await graphql`
      {
        file(relativePath: { eq: "faq.yml" }) {
          yaml: childPagesYaml {
            id
            title
            description
            subtopics {
              subtopic
              questions {
                question
                answer
              }
            }
          }
        }
      }
    `

    if (faq.errors) {
      reporter.panicOnBuild(`There was an error loading your FAQ`, faq.errors)
      return
    }

    createPage({ path: "/faq", component: noop, context: faq.data.file.yaml })
  }
}

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
