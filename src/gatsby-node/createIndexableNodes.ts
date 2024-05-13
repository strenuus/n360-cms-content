import createHelpers from "./lib/onCreateNodeHelpers";
import { CreateNodeArgs, Node } from "gatsby";

// DecapCMS stores its slugs in the name of the data file,
// where it is not easily accessible. Here, we create new nodes which include
// those slugs as part of the data. These are used in creating URL's
// for the search index (in src/gatsby-config/elasticlunr-config.js), and are also
// used on the front-end for presenting data according to the current URL.
//
// We also create nodes for each FAQ and Glossary entry so that they
// can be indexed by ElasticLunr.
//
export default function createIndexableNodes(args: CreateNodeArgs) {
  const helpers = createHelpers(args);
  const { node } = args;

  switch (node.internal.type) {
    case "HelpSectionsJson":
      node.slug = helpers.sourceFileName(node);
      helpers.createNode("HelpSection", { data: node, parent: node });
      break;

    case "HelpSubsectionsJson":
      node.slug = helpers.sourceFileName(node);
      helpers.createNode("HelpSubsection", { data: node, parent: node });
      break;

    case "HelpFaqsJson":
      node.slug = helpers.sourceFileName(node);
      const faq = helpers.createNode("HelpFaq", { data: node, parent: node });
      if (isHelpFaq(faq)) {
        for (const entry of faq.entries) {
          entry.slug = helpers.slugify(entry.question);
          helpers.createNode("FaqEntry", { data: entry, parent: faq });
        }
      }
      break;

    case "HelpGlossaryJson":
      const glossary = helpers.createNode("HelpGlossary", {
        data: node,
        parent: node,
      });
      if (isHelpGlossary(glossary)) {
        for (const entry of glossary.entries) {
          entry.slug = helpers.slugify(entry.term);
          helpers.createNode("GlossaryEntry", {
            data: entry,
            parent: glossary,
          });
        }
      }
      break;

    case "HelpVideosJson":
      node.slug = helpers.sourceFileName(node);
      helpers.createNode("HelpVideo", { data: node, parent: node });
      break;

    case "HelpVideoCollectionsJson":
      node.slug = helpers.sourceFileName(node);
      helpers.createNode("HelpVideoCollection", { data: node, parent: node });
      break;

    case "HelpArticlesJson":
      node.slug = helpers.sourceFileName(node);
      helpers.createNode("HelpArticle", { data: node, parent: node });
      break;

    default:
  }
}

type HelpFaq = Node & {
  entries: { slug: string; question: string }[];
};

type HelpGlossary = Node & {
  entries: { slug: string; term: string }[];
};

function isHelpFaq(node: Node): node is HelpFaq {
  return node.internal.type === "HelpFaq";
}

function isHelpGlossary(node: Node): node is HelpGlossary {
  return node.internal.type === "HelpGlossary";
}
