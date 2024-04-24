// @ts-check

const { ModuleFederationPlugin } = require("webpack").container
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
    HelpSubsectionsJson: {
      body: {
        type: "String",
        resolve: (source) => toMarkdown(source.body),
      },
    },
    HelpFaqsJson: {
      body: {
        type: "String",
        resolve: (source) => toMarkdown(source.body),
      },
    },
    HelpFaqsJsonEntries: {
      answer: {
        type: "String",
        resolve: (source) => toMarkdown(source.answer),
      },
    },
    HelpGlossaryJsonEntries: {
      description: {
        type: "String",
        resolve: (source) => toMarkdown(source.description),
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

  createTypes(`
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

    type HelpSubsectionsJson implements Node {
      sectionSlug: String
      title: String
      body: String
      tiles: [TileJson]
    }

    type HelpFaqsJson implements Node {
      body: String
      feature: String
      slug: String
      sectionSlug: String
      title: String
      entries: [HelpFaqsJsonEntries]
    }

    type HelpFaqsJsonEntries {
      question: String
      answer: String
      feature: String
    }

    type HelpGlossaryJson implements Node {
      entries: [HelpGlossaryJsonEntries]
    }

    type HelpGlossaryJsonEntries {
      term: String
      description: String
      feature: String
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
  extractPageData("helpSubsections", (data) => data.allHelpSubsectionsJson.nodes);
  extractPageData("helpFaqs", (data) => data.allHelpFaqsJson.nodes);
  extractPageData("helpGlossary", (data) => data.helpGlossaryJson);
  extractPageData("legacyHelp", (data) => data.allLegacyHelpJson.nodes);
  extractPageData("searchIndex", (data) => data.siteSearchIndex?.index || null);
  extractPageData("navSidebar", (data) => {
    const sectionsData = data.allHelpSectionsJson.nodes
    const subsectionsData = data.allHelpSubsectionsJson.nodes
    const sidebar = data.navSidebarJson

    for (const section of sidebar.sections) {
      const sectionData = sectionsData.find(data => data.slug === section.slug);
      section.title = sectionData.title;

      if (!Array.isArray(section.subsections)) continue;

      for (const subsection of section.subsections) {
        const subsectionData = subsectionsData.find(data => data.slug === subsection.slug);
        subsection.title = subsectionData.title;
      }
    }

    return sidebar
  });
};
