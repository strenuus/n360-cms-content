import React from "react";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import parseMarkdown from "./lib/parseMarkdown";
import DescriptionList from "./DescriptionList";

const GlossaryPreview = createPreview(({ entry, getAsset }) => {
  const entries = entry.getIn(["data", "entries"])?.toJS() || [];

  for (const entry of entries) {
    entry.description = parseMarkdown(entry.description, getAsset);
  }

  const descriptions = entries.map((e) => ({
    term: e.term,
    details: e.description,
    tagSlugs: e.tagSlugs,
  }));

  return (
    <Layout>
      <DescriptionList descriptions={descriptions} expanded={true} />
    </Layout>
  );
});

export default GlossaryPreview;
