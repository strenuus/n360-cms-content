import React from "react";
import { HelpSectionPage } from "host/helpCenter/cmsPreviewComponents";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import parseMarkdown from "./lib/parseMarkdown";

const HelpSectionPreview = createPreview(({ entry, getAsset }) => {
  const data = entry.getIn(["data"]).toJS();

  data.body = parseMarkdown(data.body, getAsset);

  for (const tile of data.tiles) {
    tile.body = parseMarkdown(tile.body, getAsset);
  }

  const page = {
    title: data.title,
    body: data.body,
    tiles: data.tiles,
  };

  return (
    <Layout>
      <HelpSectionPage resource={page} />
    </Layout>
  );
});

export default HelpSectionPreview;
