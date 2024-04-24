import { marked } from "marked";

const defaultRenderer = new marked.Renderer();

export default function parseMarkdown(string, getAsset) {
  if (!string) return string;

  const renderer = {
    image(href, title, text) {
      // Images uploaded during editing are not yet available at the url
      // which is inserted into the markdown text, so we can't render them as-is.
      // Given an asset path, getAsset returns the corresponding path in
      // local storage (if applicable) so that we can still render a live preview.
      return defaultRenderer.image(getAsset(href), title, text);
    },
  };

  marked.use({ renderer });

  return marked.parse(string);
}
