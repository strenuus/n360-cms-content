import React from "react";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import { HelpVideoPage, VideoTile } from "host/helpCenter/cmsPreviewComponents";
import PreviewSection from "./PreviewSection";
import parseMarkdown from "./lib/parseMarkdown";

const VideoPagePreview = createPreview(({ entry, getAsset }) => {
  const video = entry.getIn(["data"]).toJS();

  video.thumbnail = getAsset(video.thumbnail);
  video.description = parseMarkdown(video.description, getAsset);

  return (
    <Layout>
      <PreviewSection title="Thumbnail tile">
        <div style={{ maxWidth: "30rem" }}>
          <VideoTile video={video} />
        </div>
      </PreviewSection>
      <PreviewSection title="Page">
        <HelpVideoPage video={video} />
      </PreviewSection>
    </Layout>
  );
});

export default VideoPagePreview;
