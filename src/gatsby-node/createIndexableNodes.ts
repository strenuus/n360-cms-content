import createHelpers from "./lib/onCreateNodeHelpers";
import { CreateNodeArgs, Node } from "gatsby";

// Create nodes for each FAQ and Glossary entry so that they
// can be indexed by ElasticLunr.
//
export default function createIndexableNodes(args: CreateNodeArgs) {
  const helpers = createHelpers(args);
  const { node } = args;

  if (isHelpFaq(node)) {
    for (const entry of node.entries) {
      entry.slug = helpers.slugify(entry.question);
      helpers.createNode("FaqEntry", { data: entry, parent: node });
    }
  }

  if (isHelpGlossary(node)) {
    for (const entry of node.entries) {
      entry.slug = helpers.slugify(entry.term);
      helpers.createNode("GlossaryEntry", {
        data: entry,
        parent: node,
      });
    }
  }
}

type HelpFaq = Node & {
  entries: { slug: string; question: string }[];
};

type HelpGlossary = Node & {
  entries: { slug: string; term: string }[];
};

function isHelpFaq(node: Node): node is HelpFaq {
  return node.internal.type === "HelpFaqsJson";
}

function isHelpGlossary(node: Node): node is HelpGlossary {
  return node.internal.type === "HelpGlossaryJson";
}
