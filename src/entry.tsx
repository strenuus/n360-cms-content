import * as React from "react"
import Article from "./components/article"

export default async function createComponent() {
  const pageData = await import("cms/PageData")
  return () => <Article post={pageData.default.data.post} />
}
