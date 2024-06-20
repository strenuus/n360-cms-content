import React, { JSX } from "react";
import { MarkdownOutput as BaseMarkdownOutput } from "host/helpCenter/cmsPreviewComponents";
import { Link } from "react-router-dom-v5-compat";
import {
  FaqEmbed,
  GlossaryEmbed,
  RateAnalyticsEmbed,
  RecentReleaseNotes,
  ReleaseNotes,
  StartTour,
  VideoCollectionEmbed,
  VideoEmbed,
} from "./lib/placeholderWidgets";

export default function MarkdownOutput({ html }: { html: string }) {
  return <BaseMarkdownOutput html={html} buildWidget={buildWidget} />;
}

function buildWidget(tagName: string, dataset: DOMStringMap): JSX.Element {
  switch (tagName) {
    case "start-tour":
      return <StartTour text={dataset.text} />;
    case "release-notes":
      return <ReleaseNotes />;
    case "recent-release-notes":
      return <RecentReleaseNotes limit={Number(dataset.limit)} />;
    case "help-video-collection":
      return <VideoCollectionEmbed />;
    case "help-video":
      return <VideoEmbed />;
    case "help-article-link":
      return <Link to={"#"}>{dataset.text}</Link>;
    case "help-faq":
      return <FaqEmbed />;
    case "help-glossary":
      return <GlossaryEmbed />;
    case "rate-analytics":
      return <RateAnalyticsEmbed />;
    default:
      return (
        <div
          style={{
            background: "lightgrey",
            color: "black",
            padding: "1rem",
            border: "2px solid grey",
            borderRadius: "1rem",
          }}
        >
          {tagName} preview not available
        </div>
      );
  }
}
