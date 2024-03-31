// @ts-check

const { ModuleFederationPlugin } = require("webpack").container
const { createFilePath } = require(`gatsby-source-filesystem`)
const federationConfig = require("./config/federation").config
const { marked: markdown } = require("marked")

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

const toMarkdown = (string) => {
  if (string != null) {
    return markdown.parse(string)
  }
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    TileJson: {
      body: {
        type: "String",
        resolve: (source) => toMarkdown(source.body),
      },
    },
    HelpSectionsJson: {
      body: {
        type: "String",
        resolve: (source) => toMarkdown(source.body),
      },
    },
    LegacyHelpJson: {
      body: {
        type: "String",
        resolve: (source) => toMarkdown(source.body),
      },
    },
    LegacyHelpJsonFaqSectionsEntries: {
      answer: {
        type: "String",
        resolve: (source) => toMarkdown(source.answer),
      },
    }
  })
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

    type LegacyHelpJson implements Node {
      title: String
      sectionId: String
      order: Int
      body: String
      placeholderId: String
      feature: String
      faq: LegacyHelpJsonFaq
      videos: [LegacyHelpJsonVideos]
    }

    type LegacyHelpJsonFaq {
      sections: [LegacyHelpJsonFaqSections]
    }

    type LegacyHelpJsonFaqSections {
      title: String
      description: String
      entries: [LegacyHelpJsonFaqSectionsEntries]
    }

    type LegacyHelpJsonFaqSectionsEntries {
      question: String
      answer: String
      feature: String
    }

    type LegacyHelpJsonVideos {
      title: String
      description: String
      fileName: String
      thumbnail: String
      thumbnailAltText: String
    }

    type TileJson {
      iconName: String
      title: String
      linkPath: String
      body: String
    }

    type HomeJson implements Node {
      tiles: [TileJson]
    }

    type HelpSectionsJson implements Node {
      title: String
      body: String
      tiles: [TileJson]
    }

    type SiteSearchIndex implements Node {
      index: SiteSearchIndex_Index
    }
  `)
}

const fs = require("fs");
const path = require("path");
const extractPageData = (page, parseData) => {
  const inputPath = `./public/page-data/${page}/page-data.json`;
  const outputDir = "./public/data/"

  fs.readFile(inputPath, 'utf8', (err, pageData) => {
    if (err) throw err;

    const data = JSON.parse(pageData)["result"]["data"];
    const parsedData = parseData(data);
    const output = JSON.stringify(parsedData);

    if (!(fs.existsSync(outputDir))) fs.mkdirSync(outputDir);

    const outputPath = path.join(outputDir, `${page}.json`);

    fs.writeFile(outputPath, output, err => {
      if (err) throw err;
    });
  });
}

exports.onPostBuild = () => {
  extractPageData("home", (data) => data.homeJson);
  extractPageData("helpSections", (data) => data.allHelpSectionsJson.nodes);
  extractPageData("legacyHelp", (data) => data.allLegacyHelpJson.nodes);
  extractPageData("searchIndex", (data) => data.siteSearchIndex?.index || null);
};
