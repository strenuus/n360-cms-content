import _slugify from "slugify";
import { CreateNodeArgs, Node } from "gatsby";
import { buildNodeInput } from "./buildNodeInput";

type CustomCreateNodeOptions = {
  data: Record<string, unknown>;
  parent: Node;
};

export default function createHelpers({
  getNode,
  createNodeId,
  actions: { createNode, createParentChildLink },
}: CreateNodeArgs) {
  return {
    createNode(type: string, { data, parent }: CustomCreateNodeOptions) {
      const nodeInput = buildNodeInput({
        createNodeId,
        type,
        data,
        parent: parent.id,
      });

      createNode(nodeInput);
      createParentChildLink({ parent: parent, child: nodeInput });
      return getNode(nodeInput.id) as Node;
    },

    slugify(string: string) {
      return _slugify(string, { lower: true, strict: true });
    },
  };
}
