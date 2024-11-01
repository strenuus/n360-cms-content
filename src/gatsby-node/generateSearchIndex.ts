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
  outputDir = config.outputDir
) {
  const index = elasticlunr<Doc>();
  index.setRef("id");
  for (const field of indexedFields) index.addField(field);

  // ignore 'stop words' since we're indexing such small strings
  index.pipeline.remove(elasticlunr.stopWordFilter);

  // convert characters to their keyboard-typeable equivalents
  index.pipeline.add(makeTypeable);

  // index with stemming enabled
  for (const doc of docs) index.addDoc(doc);

  // index with stemming disabled
  index.pipeline.remove(elasticlunr.stemmer);
  for (const doc of docs) index.addDoc(doc);

  // index with special characters removed (e.g. so typing 'cant' will match "can't")
  index.pipeline.add(makeAlphanumeric);
  for (const doc of docs) index.addDoc(doc);

  // index with special characters removed and with stemming re-enabled
  index.pipeline.add(elasticlunr.stemmer);
  for (const doc of docs) index.addDoc(doc);

  // clear the list of pipeline functions so that loading the index doesn't error out
  index.pipeline.reset();

  writePageData("searchIndex", index.toJSON(), outputDir);
}

function makeTypeable(string: string): string {
  return string
    .normalize("NFD") // separate diacritics from base characters
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[“”]/g, `"`) // convert curly double quotes
    .replace(/[‘’]/g, `'`); // convert curly single quotes
}

function makeAlphanumeric(string: string): string {
  return string.replace(/[^a-zA-Z0-9]/g, "");
}
