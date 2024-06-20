import { useState } from "react";
import { Description } from "host/helpCenter/cmsPreviewComponents";
import MarkdownOutput from "./MarkdownOutput";
import { RelatedContent } from "./lib/placeholderWidgets";

export default function DescriptionList({ descriptions, expanded }) {
  const initialItems = descriptions.map((d) => ({ ...d, toggled: expanded }));
  const [items, setItems] = useState(initialItems);
  const toggleItem = (i) =>
    setItems((items) =>
      items.map((item, ii) =>
        i === ii ? { ...item, toggled: !item.toggled } : item
      )
    );

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        return (
          <Description
            key={i}
            term={item.term}
            details={
              <div className="flex flex-col items-start gap-4">
                <MarkdownOutput html={item.details} />
                <RelatedContent resource={item} />
              </div>
            }
            expanded={item.toggled}
            toggle={() => toggleItem(i)}
          />
        );
      })}
    </div>
  );
}
