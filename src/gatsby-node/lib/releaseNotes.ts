import moment from "moment";
import { releaseNotesMonthsVisible } from "../../../config/helpCenter.json";
import { Node } from "gatsby";

export type ReleaseNotes = Node & {
  releaseDate: string;
  body: string;
};

export function isReleaseNotes(node: Node): node is ReleaseNotes {
  return "releaseDate" in node && "body" in node;
}

export function isVisible(node: ReleaseNotes) {
  const cutOff = moment().utc().subtract(releaseNotesMonthsVisible, "months");
  const releaseDate = moment.utc(node.releaseDate);

  return releaseDate > cutOff;
}
