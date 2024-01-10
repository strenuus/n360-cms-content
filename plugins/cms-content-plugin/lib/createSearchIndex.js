// @ts-check

/**
 * OK, this is a little bit insane. I'm defining another gatsby-config plugin
 * from inside my plugin. Honestly, there's probably a more intelligent way of
 * doing this, but I'm low on time and scrambling. The intention was to pull
 * this logic out of the main application's gatsby-config because the purpose
 * of this plugin is to take ownership of the cms content pipeline, and
 * defining the search index is part of that pipeline. Maybe there's a better
 * way to declare nested plugins in gatsby, but I didn't see it in the docs or
 * sample projects.
 * */
module.exports = () => ({
  resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
  options: {
    // Fields to index
    fields: ["title", "tags", "description", "type"],
    // How to resolve each field`s value for a supported node type
    resolvers: {
      /** @typedef {{ frontmatter: { title: string; description: string; tags: string[]; path: string; } }} MarkdownRemark */
      /** @typedef {(node: MarkdownRemark) => string | string[]} MarkdownRemarkCallback */
      /** @type {Record<string, MarkdownRemarkCallback>} */
      // For any node of type MarkdownRemark, list how to resolve the fields` values
      MarkdownRemark: {
        title: node => node.frontmatter.title,
        description: node => node.frontmatter.description,
        tags: node => node.frontmatter.tags,
        path: node => node.frontmatter.path,
        type: () => "Article",
      },
      /** @typedef {{ title: string; description: string; }} PagesYaml */
      /** @typedef {(node: PagesYaml) => string | string[]} PagesYamlCallback */
      /** @type {Record<string, PagesYamlCallback>} */
      PagesYaml: {
        title: node => node.title,
        description: node => node.description,
        path: () => "todo",
        type: () => "Page",
      },
      /**
       * @typedef {(node: { subtopic: string }) => string} SubtopicCallback
       * @type {Record<string, SubtopicCallback>}
       */
      Subtopic: {
        title: node => node.subtopic,
        path: () => "todo",
        type: () => "Subtopic",
      },
      /**
       * @typedef {(node: { question: string; answer: string }) => string} FrequentlyAskedQuestionCallback
       * @type {Record<string, FrequentlyAskedQuestionCallback>}
       */
      FrequentlyAskedQuestion: {
        title: node => node.question,
        description: node => node.answer,
        path: () => "todo",
        type: () => "FAQ",
      },
    },
    // Optional filter to limit indexed nodes
    // filter: (node, getNode) => node.frontmatter.tags !== "exempt",
  },
})
