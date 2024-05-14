import React from "react";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import { HelpArticlePage } from "host/helpCenter/cmsPreviewComponents";
import parseMarkdown from "./lib/parseMarkdown";

const ArticlePagePreview = createPreview(({ entry, getAsset }) => {
  const article = entry.getIn(["data"]).toJS();

  article.body = parseMarkdown(article.body, getAsset);

  return (
    <Layout>
      <HelpArticlePage article={article} />
    </Layout>
  );
});

export default ArticlePagePreview;
