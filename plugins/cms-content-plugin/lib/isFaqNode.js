// @ts-check

const isFileNode = require("./isFileNode")

/**
 * @typedef {import('gatsby').Node} Node
 * @typedef {{ subtopic: string; questions: Array<{ question: string; answer: string }> }} Subtopic
 * @typedef {Node & { subtopics: Array<Subtopic> }} FaqNode
 * @param {import("gatsby").CreateNodeArgs["getNode"]} getNode
 * @param {Node} node
 * @returns {node is FaqNode}
 */
module.exports = (getNode, node) => {
  if (node.parent == null) return false
  if (node.internal.type !== "PagesYaml") return false
  const file = getNode(node.parent)
  if (file == null) return false
  return isFileNode(file) && file.relativePath === "faq.yml"
}
