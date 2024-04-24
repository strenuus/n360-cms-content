import crypto from "crypto";
import { CreateNodeArgs, NodeInput } from "gatsby";

type buildNodeInputArgs = {
  createNodeId: CreateNodeArgs["createNodeId"];
  type: string;
  data: Record<string, unknown>;
  parent?: string;
};

export function buildNodeInput({
  createNodeId,
  type,
  data,
  parent,
}: buildNodeInputArgs): NodeInput {
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
}
