import elasticlunr from "elasticlunr";
import { writePageData } from "./lib/pageData";
import config from "./lib/config";

export type Doc = {
  id: string;
  title: string;
  features: string[];
  description: string | null;
  tagTitles: string[];
  tagSlugs: string[];
  path: string;
  type: string;
  thumbnail?: string;
  duration?: {
    mm: number;
    ss: number;
  };
};

const indexedFields = ["title", "description", "tagTitles"] as const;

export default function generateSearchIndex(
  docs: Doc[],
  outputDir = config.outputDir,
) {
  elasticlunr.clearStopWords();
  const index = elasticlunr<Doc>();
  index.setRef("id");

  for (const field of indexedFields) index.addField(field);
  for (const doc of docs) index.addDoc(doc);

  writePageData("searchIndex", index.toJSON(), outputDir);
}
