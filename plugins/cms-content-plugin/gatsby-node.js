// @ts-check

const isFaqNode = require("./lib/isFaqNode");
const createCustomNode = require("./lib/createCustomNode");

/** @param {import("gatsby").CreateNodeArgs} args */
exports.onCreateNode = async ({ node, actions, getNode, createNodeId }) => {
  const { createNode, createParentChildLink } = actions;

  // Find the FAQ page and create gatsby nodes for each subtopic and FAQ so
  // that they can be indexed by elasticlunr
  if (isFaqNode(getNode, node)) {
    for (const { subtopic, questions } of node.subtopics) {
      const data = { subtopic };
      const subtopicNode = createCustomNode(createNodeId, {
        type: "Subtopic",
        data,
        parent: node.id,
      });

      await createNode(subtopicNode);
      createParentChildLink({ parent: node, child: subtopicNode });

      // TODO: I'm not sure why gatsby expects this? Seems like an overzealous typescript definition
      const parentNode = {
        ...subtopicNode,
        internal: {
          ...subtopicNode.internal,
          owner: "network360-cms-content",
        },
      };

      for (const faq of questions) {
        const faqNode = createCustomNode(createNodeId, {
          type: "FrequentlyAskedQuestion",
          data: faq,
          parent: subtopicNode.id,
        });

        await createNode(faqNode);
        createParentChildLink({ parent: parentNode, child: faqNode });
      }
    }
  }
};

/** @param {import("gatsby").CreateSchemaCustomizationArgs} args */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type Subtopic implements Node {
      subtopic: String
    }

    type FrequentlyAskedQuestion implements Node {
      question: String
      answer: String
    }
  `);
};
