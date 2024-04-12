// @ts-check

const crypto = require("crypto");

/**
 * @param {import("gatsby").CreateNodeArgs["createNodeId"]} createNodeId
 * @param {{ type: string; data: Record<string, unknown>; parent?: string }} args
 */
module.exports = (createNodeId, { type, data, parent }) => {
  const json = JSON.stringify(data);
  return {
    ...data,
    id: createNodeId(crypto.randomUUID()),
    parent: parent ?? null,
    children: [],
    internal: {
      type,
      contentDigest: crypto.createHash("md5").update(json).digest("hex"),
      content: json,
    },
  };
};
