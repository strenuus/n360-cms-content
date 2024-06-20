import React from "react";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import { HelpArticlePage } from "host/helpCenter/cmsPreviewComponents";
import parseMarkdown from "./lib/parseMarkdown";

const ReleaseNotesPreview = createPreview(({ entry, getAsset }) => {
  const releaseNotes = entry.getIn(["data"]).toJS();

  const date = releaseNotes.releaseDate || "0000-00-00";

  const [y, m, d] = date.split("-");

  const article = {
    title: [m, d, y].join("-"),
    body: parseMarkdown(releaseNotes.body, getAsset),
  };

  return (
    <Layout>
      <HelpArticlePage resource={article} />
    </Layout>
  );
});

export default ReleaseNotesPreview;
