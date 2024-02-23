import React from "react";
import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';

const MarkdownOutput = ({children: htmlString}: {children: string}) => {
  return <div className="markdown-output">
    {parse(htmlString, options)}
  </div>
};

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (!(domNode instanceof Element)) return;

    if (domNode.name === "start-tour") {
      return <StartTour>{textContent(domNode)}</StartTour>;
    }
  },
};

const StartTour = ({children}: {children: string | undefined}) => {
  return <a href="#" className="btn btn-default">
    {children || "Start Tour"}
  </a>
};

const textContent = ({children}: Element) => {
  if (children?.length != 1) return;
  const child = children[0];
  if (child.type === "text") return child.data;
}

export default MarkdownOutput;
