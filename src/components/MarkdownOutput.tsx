import React, { useRef, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

const magicSelectors = ["start-tour"];

export default function MarkdownOutput({html}: {html: string}) {
  const domRef = useRef<HTMLDivElement>(null);
  const [magicElements, setMagicElements] = useState<HTMLElement[]>([]);

  useLayoutEffect(() => {
    if (domRef.current) {
      setMagicElements(Array.from(domRef.current.querySelectorAll(magicSelectors.join(','))))
    }
  }, [domRef.current, html]);

  useLayoutEffect(() => {
    if (domRef.current) disableLinksAndButtons(domRef.current);
  });

  return <>
    <div ref={domRef} className="markdown-output" dangerouslySetInnerHTML={{ __html: html }}></div>
    {magicElements.map(el => createPortal(buildComponent(el), el))}
  </>
};

const disableLinksAndButtons = (domNode: HTMLDivElement) => {
  domNode.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", (e) => e.preventDefault());
  });
}

const buildComponent = (el: HTMLElement) => {
  switch (el.tagName.toLowerCase()) {
    case "start-tour":
      return <StartTour text={el.dataset.text} />;
  }
}

const StartTour = ({text}: {text: string | undefined}) => {
  return <a href="#" className="btn btn-default">
    {text || "Start Tour"}
  </a>
};
