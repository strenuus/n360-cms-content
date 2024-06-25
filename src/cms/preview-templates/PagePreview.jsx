import React from "react";
import MarkdownOutput from "./MarkdownOutput";
import { RelatedContent } from "./lib/placeholderWidgets";
import { Tiles } from "host/helpCenter/cmsPreviewComponents";
import createPreview from "./lib/createPreview";
import { Layout } from "./HelpCenterLayout";
import parseMarkdown from "./lib/parseMarkdown";

const PagePreview = createPreview(({ entry, getAsset }) => {
  const data = entry.getIn(["data"]).toJS();

  data.body = parseMarkdown(data.body, getAsset);
  data.tiles ||= [];

  for (const tile of data.tiles) tile.body = parseMarkdown(tile.body, getAsset);

  return (
    <Layout>
      <Page data={data} />
    </Layout>
  );
});

export default PagePreview;

export function Page({ data }) {
  const tiles = data.tiles || [];

  return (
    <div className="flex grow flex-col gap-8">
      <header className="flex items-start justify-between gap-8 empty:hidden">
        {data.title ? <h3 className="m-0">{data.title}</h3> : null}
        <RelatedContent resource={data} />
      </header>
      {data.body ? <MarkdownOutput html={data.body} /> : null}
      {tiles.length > 0 ? (
        <Tiles
          tiles={tiles}
          horizontalHeaders
          MarkdownOutput={MarkdownOutput}
        />
      ) : null}
    </div>
  );
}
