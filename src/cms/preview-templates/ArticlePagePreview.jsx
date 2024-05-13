import React from "react";
import { Layout } from "./HelpCenterLayout";
import createPreview from "./lib/createPreview";
import { HelpArticlePage } from "host/helpCenter/cmsPreviewComponents";

const ArticlePagePreview = createPreview(({ entry }) => {
  const article = entry.getIn(["data"]).toJS();

  return (
    <Layout>
      <HelpArticlePage article={article} />
    </Layout>
  );
});

export default ArticlePagePreview;
