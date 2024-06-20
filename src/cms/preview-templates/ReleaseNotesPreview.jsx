import React from "react";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import parseMarkdown from "./lib/parseMarkdown";
import { Page } from "./PagePreview";

const ReleaseNotesPreview = createPreview(({ entry, getAsset }) => {
  const releaseNotes = entry.getIn(["data"]).toJS();

  const date = releaseNotes.releaseDate || "0000-00-00";

  const [y, m, d] = date.split("-");

  const data = {
    title: [m, d, y].join("-"),
    body: parseMarkdown(releaseNotes.body, getAsset),
  };

  return (
    <Layout>
      <Page data={data} />
    </Layout>
  );
});

export default ReleaseNotesPreview;
