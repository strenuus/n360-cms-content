import React from "react";
import { Tiles } from "host/helpCenter/cmsPreviewComponents";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import parseMarkdown from "./lib/parseMarkdown";

const HomePagePreview = createPreview(({ entry, getAsset }) => {
  const { tiles } = entry.getIn(["data"]).toJS();

  tiles.forEach((tile) => {
    if (tile.body) tile.body = parseMarkdown(tile.body, getAsset);
  });

  return (
    <Layout>
      <Tiles tiles={tiles} />
    </Layout>
  );
});

export default HomePagePreview;
