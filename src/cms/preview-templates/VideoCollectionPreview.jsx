import React from "react";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import { VideoCollection } from "host/helpCenter/cmsPreviewComponents";

const VideoCollectionPreview = createPreview(({ entry }) => {
  const collection = entry.getIn(["data"]).toJS();

  return (
    <Layout>
      <VideoCollection collection={collection} />
    </Layout>
  );
});

export default VideoCollectionPreview;
