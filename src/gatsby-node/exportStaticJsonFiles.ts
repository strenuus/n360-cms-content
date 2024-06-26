import generateSearchIndex, { Doc } from "./generateSearchIndex";
import extractPageData, {
  readPageData,
  writePageData,
  SectionData,
  SubsectionData,
  FaqData,
  SidebarData,
  GlossaryData,
  ReleaseNotesData,
  ArticleData,
  VideoData,
  TagData,
} from "./lib/pageData";

export default function exportStaticJsonFiles() {
  const sections = parseSections();
  const subsections = parseSubsections(sections);
  const faqs = parseFaqs(subsections);
  const glossary = parseGlossary(subsections);
  const articles = parseArticles(sections, subsections);
  const videos = parseVideos(sections, subsections);
  const navSidebar = parseNavSidebar(sections, subsections);
  const releaseNotes = parseReleaseNotes();
  const tags = readPageData("tags");

  writePageData("helpSections", sections);
  writePageData("helpSubsections", subsections);
  writePageData("helpFaqs", faqs);
  writePageData("helpGlossary", glossary);
  writePageData("helpArticles", articles);
  writePageData("helpVideos", videos);
  writePageData("navSidebar", navSidebar);
  writePageData("releaseNotes", releaseNotes);
  writePageData("tags", tags);

  extractPageData("helpSearchHints");
  extractPageData("home");
  extractPageData("helpVideoCollections");
  extractPageData("tagTypes");

  const docs = buildSearchDocuments(
    [
      ...sections,
      ...subsections,
      ...faqs,
      ...faqs.flatMap((faq) => faq.entries),
      ...glossary.entries,
      ...articles,
      ...videos,
      ...releaseNotes,
    ],
    tags
  );

  generateSearchIndex(docs);
}

const helpCenter = "/help";

type Section = SectionData & {
  type: "Section";
  features: string[];
  path: string;
};

function parseSections(): Section[] {
  return readPageData("helpSections").map((section) => ({
    type: "Section",
    ...section,
    features: stringArray([section.feature]),
    path: `${helpCenter}/sections/${section.slug}`,
  }));
}

type Subsection = SubsectionData & {
  type: "Subsection";
  features: string[];
  path: string;
};

function parseSubsections(sections: Section[]): Subsection[] {
  return readPageData("helpSubsections").map((subsection) => {
    const section = findBySlug(sections, subsection.sectionSlug);

    return {
      type: "Subsection",
      ...subsection,
      features: stringArray([...section.features, subsection.feature]),
      path: `${helpCenter}/sections/${subsection.sectionSlug}/sections/${subsection.slug}`,
    };
  });
}

type Faq = FaqData & {
  type: "Faq";
  features: string[];
  path: string;
  entries: FaqEntry[];
};

type FaqEntry = FaqData["entries"][number] & {
  type: "FaqEntry";
  features: string[];
  path: string;
};

function parseFaqs(subsections: Subsection[]): Faq[] {
  return readPageData("helpFaqs").map((faq) => {
    const subsection = findBySlug(subsections, faq.sectionSlug);
    const pagePath = `${helpCenter}/sections/faq/sections/${faq.sectionSlug}`;

    const features = stringArray([...subsection.features, faq.feature]);

    return {
      type: "Faq",
      ...faq,
      features,
      path: `${pagePath}?${queryString({ s: faq.slug })}`,
      entries: faq.entries.map((entry) => ({
        type: "FaqEntry",
        ...entry,
        features: stringArray([...features, entry.feature]),
        path: `${pagePath}?${queryString({
          s: faq.slug,
          q: entry.slug,
        })}`,
      })),
    };
  });
}

type GlossaryEntry = GlossaryData["entries"][number] & {
  type: "GlossaryEntry";
  features: string[];
  path: string;
};

type Glossary = {
  entries: GlossaryEntry[];
};

function parseGlossary(subsections: Subsection[]): Glossary {
  const glossaryData = readPageData("helpGlossary");

  return {
    entries: glossaryData.entries.map((entry) => {
      const firstLetter = entry.slug[0];
      const path = `${helpCenter}/sections/glossary?${queryString({
        s: firstLetter,
        t: entry.slug,
      })}`;

      return {
        type: "GlossaryEntry",
        ...entry,
        features: stringArray([entry.feature]),
        path,
      };
    }),
  };
}

type Article = ArticleData & {
  type: "Article";
  features: string[];
  path: string;
};

function parseArticles(
  sections: Section[],
  subsections: Subsection[]
): Article[] {
  return readPageData("helpArticles").map((article) => {
    const parent = getParent(article, sections, subsections);

    return {
      type: "Article",
      ...article,
      features: stringArray([...(parent?.features || []), article.feature]),
      path: dynamicPath(article, "articles", subsections),
    };
  });
}

type Video = VideoData & {
  type: "Video";
  features: string[];
  path: string;
};

function parseVideos(sections: Section[], subsections: Subsection[]): Video[] {
  return readPageData("helpVideos").map((video) => {
    const parent = getParent(video, sections, subsections);

    return {
      type: "Video",
      ...video,
      features: stringArray([...(parent?.features || []), video.feature]),
      path: dynamicPath(video, "videos", subsections),
    };
  });
}

type SideBarSection = SidebarData["sections"][number] & {
  title: string;
  features: string[];
  subsections: SideBarSubsection[];
};

type SideBarSubsection =
  SidebarData["sections"][number]["subsections"][number] & {
    title: string;
    features: string[];
  };

type Sidebar = SidebarData & {
  sections: SideBarSection[];
};

function parseNavSidebar(
  sections: Section[],
  subsections: Subsection[]
): Sidebar {
  const sidebarData = readPageData("navSidebar");

  return {
    sections: sidebarData.sections.map((sectionData) => {
      const section = findBySlug(sections, sectionData.slug);

      return {
        ...sectionData,
        title: section.title,
        features: section.features,
        subsections: sectionData.subsections.map((subsectionData) => {
          const subsection = findBySlug(subsections, subsectionData.slug);

          return {
            ...subsectionData,
            title: subsection.title,
            features: subsection.features,
          };
        }),
      };
    }),
  };
}

type ReleaseNotes = ReleaseNotesData & {
  type: "ReleaseNotes";
  path: string;
};

function parseReleaseNotes(): ReleaseNotes[] {
  return readPageData("releaseNotes").map((releaseNotes) => ({
    type: "ReleaseNotes",
    ...releaseNotes,
    path: `${helpCenter}/sections/whats-new/sections/release-notes?${queryString(
      { date: releaseNotes.slug }
    )}`,
  }));
}

type Indexed =
  | Section
  | Subsection
  | Faq
  | FaqEntry
  | GlossaryEntry
  | Video
  | Article
  | ReleaseNotes;

function buildSearchDocuments(items: Indexed[], tags: TagData[]) {
  return items.map((item) => makeDoc(item, tags));
}

function makeDoc(item: Indexed, tags: TagData[]): Doc {
  const id = item.id;
  const title =
    item.type === "FaqEntry"
      ? item.question
      : item.type === "GlossaryEntry"
      ? item.term
      : item.title;
  const description = item.shortDescription || null;
  const features = item.type === "ReleaseNotes" ? [] : item.features;
  const tagSlugs =
    "tagSlugs" in item && item.tagSlugs ? stringArray(item.tagSlugs) : [];
  const tagTitles = stringArray(
    tagSlugs.map((slug) => tags.find((t) => t.slug === slug)?.title)
  );
  const path = item.path;
  const type = docTypes[item.type];

  const doc: Doc = {
    id,
    title,
    description,
    features,
    tagSlugs,
    tagTitles,
    path,
    type,
  };

  if (item.type === "Video") {
    doc.thumbnail = item.thumbnail;
    doc.duration = item.duration;
  }

  return doc;
}

type DocType =
  | "Page"
  | "FAQ"
  | "Glossary"
  | "Video"
  | "Document"
  | "Release Notes";

const docTypes: Record<Indexed["type"], DocType> = {
  Section: "Page",
  Subsection: "Page",
  Faq: "FAQ",
  FaqEntry: "FAQ",
  GlossaryEntry: "Glossary",
  Video: "Video",
  Article: "Document",
  ReleaseNotes: "Release Notes",
};

function stringArray(array: unknown[]): string[] {
  return array.filter(isString);
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

function queryString(obj: Record<string, string>): string {
  return new URLSearchParams(obj).toString();
}

function dynamicPath<
  T extends {
    slug: string;
    sectionSlug?: string | null;
    subsectionSlug?: string | null;
  }
>(resource: T, subdir: string, subsections: Subsection[]): string {
  if (resource.subsectionSlug) {
    const subsection = findBySlug(subsections, resource.subsectionSlug);
    return `${helpCenter}/sections/${subsection.sectionSlug}/sections/${subsection.slug}/${subdir}/${resource.slug}`;
  } else if (resource.sectionSlug) {
    return `${helpCenter}/sections/${resource.sectionSlug}/${subdir}/${resource.slug}`;
  } else {
    return `${helpCenter}/${subdir}/${resource.slug}`;
  }
}

function findBySlug<T extends { slug: string }>(items: T[], slug: string): T {
  const item = items.find((item) => item.slug === slug);

  if (item) {
    return item;
  } else {
    throw new Error(`Item with slug '${slug}' not found!`);
  }
}

function getParent<
  T extends { sectionSlug?: string | null; subsectionSlug?: string | null }
>(
  resource: T,
  sections: Section[],
  subsections: Subsection[]
): Section | Subsection | null {
  return resource.subsectionSlug
    ? findBySlug(subsections, resource.subsectionSlug)
    : resource.sectionSlug
    ? findBySlug(sections, resource.sectionSlug)
    : null;
}
