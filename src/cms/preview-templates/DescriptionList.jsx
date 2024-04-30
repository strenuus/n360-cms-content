import { Description } from "host/helpCenter/cmsPreviewComponents";

export default function DescriptionList({ descriptions, expanded }) {
  return (
    <div className="flex flex-col gap-3">
      {descriptions.map((entry, i) => {
        return (
          <Description
            key={i}
            term={entry.term}
            details={entry.details}
            expanded={expanded}
            toggle={() => null}
          />
        );
      })}
    </div>
  );
}
