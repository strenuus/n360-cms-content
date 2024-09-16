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
  TagTypeData,
} from "./lib/pageData";
import config from "./lib/config";

export default function exportStaticJsonFiles(
  pageDataDir: string = config.pageDataDir,
  outputDir: string = config.outputDir,
) {
  const [tags, tagTypes] = parseTags(pageDataDir);
  const sections = parseSections(pageDataDir, tags);
  const subsections = parseSubsections(sections, pageDataDir, tags);

  const faqs = parseFaqs(subsections, pageDataDir, tags);
  const glossary = parseGlossary(pageDataDir, tags);
  const articles = parseArticles(sections, subsections, pageDataDir, tags);
  const videos = parseVideos(sections, subsections, pageDataDir, tags);
  const navSidebar = parseNavSidebar(sections, subsections, pageDataDir);
  const releaseNotes = parseReleaseNotes(pageDataDir);

  writePageData("helpSections", sections, outputDir);
  writePageData("helpSubsections", subsections, outputDir);
  writePageData("helpFaqs", faqs, outputDir);
  writePageData("helpGlossary", glossary, outputDir);
  writePageData("helpArticles", articles, outputDir);
  writePageData("helpVideos", videos, outputDir);
  writePageData("navSidebar", navSidebar, outputDir);
  writePageData("releaseNotes", releaseNotes, outputDir);
  writePageData("tags", tags, outputDir);
  writePageData("tagTypes", tagTypes, outputDir);

  extractPageData("helpSearchHints", pageDataDir, outputDir);
  extractPageData("home", pageDataDir, outputDir);
  extractPageData("helpVideoCollections", pageDataDir, outputDir);

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
    tags,
  );

  generateSearchIndex(docs);
}

const helpCenter = "/help";

type Section = SectionData & {
  type: "Section";
  features: string[];
  path: string;
};

function parseSections(pageDataDir: string, tags: Tag[]): Section[] {
  return readPageData("helpSections", pageDataDir).map((section) => ({
    type: "Section",
    ...section,
    tagSlugs: validTagSlugs(section, tags),
    features: stringArray([section.feature]),
    path: `${helpCenter}/sections/${section.slug}`,
  }));
}

type Subsection = SubsectionData & {
  type: "Subsection";
  features: string[];
  path: string;
};

function parseSubsections(
  sections: Section[],
  pageDataDir: string,
  tags: Tag[],
): Subsection[] {
  return readPageData("helpSubsections", pageDataDir)
    .filter((subsection) => itemExists(sections, subsection.sectionSlug))
    .map((subsection) => {
      const section = findBySlug(sections, subsection.sectionSlug);

      return {
        type: "Subsection",
        ...subsection,
        tagSlugs: validTagSlugs(subsection, tags),
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

function parseFaqs(
  subsections: Subsection[],
  pageDataDir: string,
  tags: Tag[],
): Faq[] {
  return readPageData("helpFaqs", pageDataDir)
    .filter(({ sectionSlug }) => itemExists(subsections, sectionSlug))
    .map((faq) => {
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
          tagSlugs: validTagSlugs(entry, tags),
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

function parseGlossary(pageDataDir: string, tags: Tag[]): Glossary {
  const glossaryData = readPageData("helpGlossary", pageDataDir);

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
        tagSlugs: validTagSlugs(entry, tags),
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
  subsections: Subsection[],
  pageDataDir: string,
  tags: Tag[],
): Article[] {
  return readPageData("helpArticles", pageDataDir)
    .filter((article) =>
      article.subsectionSlug
        ? itemExists(subsections, article.subsectionSlug)
        : article.sectionSlug
          ? itemExists(sections, article.sectionSlug)
          : true,
    )
    .map((article) => {
      const parent = getParent(article, sections, subsections);

      return {
        type: "Article",
        ...article,
        tagSlugs: validTagSlugs(article, tags),
        features: stringArray([...(parent?.features || []), article.feature]),
        path: dynamicPath(article, "articles", sections, subsections),
      };
    });
}

type Video = VideoData & {
  type: "Video";
  features: string[];
  path: string;
};

function parseVideos(
  sections: Section[],
  subsections: Subsection[],
  pageDataDir: string,
  tags: Tag[],
): Video[] {
  return readPageData("helpVideos", pageDataDir)
    .filter((video) =>
      video.subsectionSlug
        ? itemExists(subsections, video.subsectionSlug)
        : video.sectionSlug
          ? itemExists(sections, video.sectionSlug)
          : true,
    )
    .map((video) => {
      const parent = getParent(video, sections, subsections);

      return {
        type: "Video",
        ...video,
        tagSlugs: validTagSlugs(video, tags),
        features: stringArray([...(parent?.features || []), video.feature]),
        path: dynamicPath(video, "videos", sections, subsections),
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
  subsections: Subsection[],
  pageDataDir: string,
): Sidebar {
  const sidebarData = readPageData("navSidebar", pageDataDir);

  return {
    sections: sidebarData.sections
      .filter(({ slug }) => itemExists(sections, slug))
      .map((sectionData) => {
        const section = findBySlug(sections, sectionData.slug);

        return {
          ...sectionData,
          title: section.title,
          features: section.features,
          subsections: sectionData.subsections
            .filter(({ slug }) => itemExists(subsections, slug))
            .map((subsectionData) => {
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

function parseReleaseNotes(pageDataDir: string): ReleaseNotes[] {
  return readPageData("releaseNotes", pageDataDir).map((releaseNotes) => ({
    type: "ReleaseNotes",
    ...releaseNotes,
    path: `${helpCenter}/sections/whats-new/sections/release-notes?${queryString(
      { date: releaseNotes.slug },
    )}`,
  }));
}

type Tag = TagData & { type: "Tag" };
type TagType = TagTypeData & { type: "TagType" };

function parseTags(pageDataDir: string): [Tag[], TagType[]] {
  const tagTypes: TagType[] = readPageData("tagTypes", pageDataDir).map(
    (data) => ({
      ...data,
      type: "TagType",
    }),
  );

  const tags: Tag[] = readPageData("tags", pageDataDir)
    .filter(({ typeSlug }) => itemExists(tagTypes, typeSlug))
    .map((data) => ({ ...data, type: "Tag" }));

  return [tags, tagTypes];
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
    tagSlugs.map((slug) => tags.find((t) => t.slug === slug)?.title),
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
  },
>(
  resource: T,
  subdir: string,
  sections: Section[],
  subsections: Subsection[],
): string {
  if (itemExists(subsections, resource.subsectionSlug)) {
    const subsection = findBySlug(subsections, resource.subsectionSlug);
    return `${helpCenter}/sections/${subsection.sectionSlug}/sections/${subsection.slug}/${subdir}/${resource.slug}`;
  } else if (itemExists(sections, resource.sectionSlug)) {
    return `${helpCenter}/sections/${resource.sectionSlug}/${subdir}/${resource.slug}`;
  } else {
    return `${helpCenter}/${subdir}/${resource.slug}`;
  }
}

function findBySlug<T extends { slug: string }>(
  items: T[],
  slug: string | null | undefined,
): T {
  const item = items.find((item) => item.slug === slug);

  if (item) {
    return item;
  } else {
    throw new Error(`Item with slug '${slug}' not found!`);
  }
}

function itemExists<T extends { slug: string }>(
  items: T[],
  slug: string | null | undefined,
): boolean {
  try {
    findBySlug(items, slug);
    return true;
  } catch {
    return false;
  }
}

function validTagSlugs<T extends { tagSlugs?: string[] | null | undefined }>(
  resource: T,
  allTags: Tag[],
): string[] {
  const slugs = resource.tagSlugs || [];
  return slugs.filter((s) => allTags.some(({ slug }) => slug === s));
}

function getParent<
  T extends { sectionSlug?: string | null; subsectionSlug?: string | null },
>(
  resource: T,
  sections: Section[],
  subsections: Subsection[],
): Section | Subsection | null {
  return itemExists(subsections, resource.subsectionSlug)
    ? findBySlug(subsections, resource.subsectionSlug)
    : itemExists(sections, resource.sectionSlug)
      ? findBySlug(sections, resource.sectionSlug)
      : null;
}
