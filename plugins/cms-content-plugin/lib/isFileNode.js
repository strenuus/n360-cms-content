// @ts-check

/**
 * @typedef {import('gatsby').Node} Node
 * @typedef {Node & { relativePath: string }} FileNode
 * @param {Node} node
 * @returns {node is FileNode}
 */
module.exports = (node) => {
  return node.internal.type === "File";
};
