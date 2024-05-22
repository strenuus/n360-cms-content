import React from "react";
import { MarkdownOutput } from "host/helpCenter/cmsPreviewComponents";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import parseMarkdown from "./lib/parseMarkdown";
import DescriptionList from "./DescriptionList";

const FaqSectionPreview = createPreview(({ entry, getAsset }) => {
  const data = entry.getIn(["data"]).toJS();

  data.body = parseMarkdown(data.body, getAsset);

  for (const entry of data.entries) {
    entry.answer = parseMarkdown(entry.answer, getAsset);
  }

  const descriptions = data.entries.map((e) => ({
    term: e.question,
    details: e.answer,
  }));

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <h3>{data.title}</h3>
        <MarkdownOutput html={data.body} />
        <DescriptionList descriptions={descriptions} expanded={true} />
      </div>
    </Layout>
  );
});

export default FaqSectionPreview;
