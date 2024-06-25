import React from "react";
import { Link } from "react-router-dom-v5-compat";
import {
  Accordion,
  RelatedContentButton,
} from "host/helpCenter/cmsPreviewComponents";
import DescriptionList from "../DescriptionList";
import { Badge } from "host/helpCenter/cmsPreviewComponents";

export { StartTour } from "host/helpCenter/cmsPreviewComponents";

export function ReleaseNotes() {
  const dates = recentDates(12).map(formatDate);

  return (
    <>
      {dates.map((date, index) => (
        <Accordion key={index} summary={date} expanded={false} details={null} />
      ))}
    </>
  );
}

export function RecentReleaseNotes({ limit: limitArg }: { limit: number }) {
  const limit = limitArg > 0 ? limitArg : 5;

  const dates = recentDates(limit).map(formatDate);

  return (
    <>
      {dates.map((date, index) => (
        <p key={index}>
          <Link to={"#"}>{date}</Link>
        </p>
      ))}
      <p>
        <Link to={"#"}>
          View all <i className="fa-regular fa-angle-right"></i>
        </Link>
      </p>
    </>
  );
}

function recentDates(n: number) {
  const currentDate = new Date();

  const dates = [];

  for (let i = 0; i < n; i++) {
    dates.push(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    );
  }

  return dates;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function RelatedContent<T extends { tagSlugs?: string[] }>({
  resource,
}: {
  resource: T;
}) {
  const tags = resource.tagSlugs || [];

  return tags.length < 1 ? null : <RelatedContentButton />;
}

export function VideoEmbed() {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-solid border-systemgray-300`}
    >
      <video controls className="w-full" preload="metadata">
        <source src={"#"} />
      </video>
      <div className="flex flex-col items-start gap-4 p-4 empty:hidden">
        <Link
          to={"#"}
          className={`block text-[1.75rem] font-medium text-inherit no-underline`}
        >
          Video Title
        </Link>
        <p className="m-0">Short description of video.</p>
        <RelatedContent resource={{ tagSlugs: ["example-tag"] }} />
      </div>
    </div>
  );
}

export function FaqEmbed() {
  return (
    <>
      <Accordion summary={"FAQ Section"} expanded={false} details={null} />
      <Accordion summary={"FAQ Section"} expanded={false} details={null} />
      <Accordion summary={"FAQ Section"} expanded={false} details={null} />
    </>
  );
}

export function GlossaryEmbed() {
  const questions = new Array(2).fill({
    term: "Glossary Term",
    details: "Definition.",
  });

  return (
    <>
      <Accordion
        summary={"A"}
        expanded={true}
        details={<DescriptionList descriptions={questions} expanded={false} />}
      />
      <Accordion
        summary={"B"}
        expanded={true}
        details={<DescriptionList descriptions={questions} expanded={false} />}
      />
      <Accordion
        summary={"C"}
        expanded={true}
        details={<DescriptionList descriptions={questions} expanded={false} />}
      />
    </>
  );
}

export function RateAnalyticsEmbed() {
  return (
    <>
      <Accordion
        summary={"Zelis Plan Intelligence Reference Guide"}
        expanded={false}
        details={null}
      />
      <Accordion
        summary={"Primary and Comparison Reporting Plan Groups"}
        expanded={false}
        details={null}
      />
      <Accordion
        summary={"Analysis Parameters"}
        expanded={false}
        details={null}
      />
      <Accordion
        summary={"Rates Analysis - Results"}
        expanded={false}
        details={null}
      />
      <Accordion
        summary={"Terminology - Rate Analytics"}
        expanded={false}
        details={null}
      />
    </>
  );
}

export function VideoCollectionEmbed() {
  const pageVideos = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flex flex-col gap-8">
      <div
        className={`grid grid-cols-[repeat(auto-fill,minmax(max(28rem,30%),1fr))] gap-8`}
      >
        {pageVideos.map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-lg border border-solid border-systemgray-300"
          >
            <Link
              to={"#"}
              className="select-none bg-systemgray-100 no-underline"
              style={{ display: "grid", gridTemplateAreas: "'thumbnail'" }}
            >
              <div
                className="aspect-video h-full w-full object-cover"
                style={{ gridArea: "thumbnail" }}
              ></div>
              <Badge
                colorClass="bg-systemgray-900/50"
                textClass="text-white"
                className={"m-4"}
                style={{ gridArea: "thumbnail", placeSelf: "end end" }}
                text={"1:30"}
              />
            </Link>
            <div className="flex h-full flex-col items-start gap-4 p-4 empty:hidden">
              <Link
                to={"#"}
                className={`mb-0 block text-[1.75rem] font-medium text-inherit no-underline`}
              >
                Video Title
              </Link>
              <p className="m-0">Short video description.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
