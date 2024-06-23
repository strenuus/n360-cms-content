import fs from "fs";
import path from "path";
import { z } from "zod";

type PageKey = keyof typeof pages;
type PageValue<K extends keyof typeof pages> = (typeof pages)[K];

export default function extractPageData(page: PageKey) {
  const data = readPageData(page);

  writePageData(page, data);
}

export function readPageData<K extends keyof typeof pages>(
  page: K
): z.infer<PageValue<K>> {
  const inputPath = `./public/page-data/${page}/page-data.json`;

  const pageData = fs.readFileSync(inputPath, { encoding: "utf8" });
  const data = JSON.parse(pageData)["result"]["data"];
  const extracted = extract(data);

  if (extracted === null) {
    switch (page) {
      case "home":
      case "helpSearchHints":
        return { tiles: [] };
      case "navSidebar":
        return { sections: [] };
      case "helpGlossary":
        return { entries: [] };
      default:
        return [];
    }
  } else {
    const schema = pages[page];
    const parsed = schema.parse(extracted);

    return parsed;
  }
}

function extract(data: Record<string, Record<string, unknown>>) {
  const resourceName = Object.keys(data).at(0) as string;
  const resource = data[resourceName];

  return resource?.nodes || resource;
}

export function writePageData(page: keyof typeof pages, data: unknown) {
  const output = JSON.stringify(data, null, 2);
  const outputDir = "./public/data/";

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(outputDir, `${page}.json`);
  console.info(`writing ${outputPath}`);
  fs.writeFileSync(outputPath, output);
}

const id = z.string();
const title = z.string();
const slug = z.string();
const iconName = z.string();
const shortDescription = z.string().nullable().optional();

const tiles = z
  .array(
    z.object({
      iconName,
      title,
      linkPath: z.string().nullable(),
      body: z.string().nullable(),
    })
  )
  .nullable();

const tagSlugs = z.array(z.string()).nullable().optional();

const feature = z.string().nullable().optional();

const page = {
  id,
  title,
  slug,
  body: z.string().nullable(),
  feature,
  tagSlugs,
  shortDescription,
};

const pages = {
  helpSections: z.array(
    z.object({
      ...page,
      tiles,
    })
  ),
  helpSubsections: z.array(
    z.object({
      ...page,
      tiles,
      sectionSlug: z.string(),
    })
  ),
  helpFaqs: z.array(
    z.object({
      id,
      sectionSlug: z.string(),
      feature,
      title,
      slug,
      body: z.string().nullable(),
      shortDescription,
      entries: z.array(
        z.object({
          id,
          question: z.string(),
          answer: z.string(),
          feature,
          tagSlugs,
          slug,
          shortDescription,
        })
      ),
    })
  ),
  helpArticles: z.array(
    z.object({
      ...page,
      sectionSlug: z.string().nullable().optional(),
      subsectionSlug: z.string().nullable().optional(),
      body: z.string(),
      shortDescription: z.string().nullable(),
    })
  ),
  helpVideos: z.array(
    z.object({
      id,
      sectionSlug: z.string().nullable().optional(),
      subsectionSlug: z.string().nullable().optional(),
      feature,
      tagSlugs,
      title,
      slug,
      shortDescription,
      description: z.string().nullable(),
      url: z.string(),
      thumbnail: z.string(),
      duration: z.object({
        mm: z.number(),
        ss: z.number(),
      }),
    })
  ),
  navSidebar: z.object({
    sections: z.array(
      z.object({
        iconName: z.string(),
        slug: z.string(),
        subsections: z.array(
          z.object({
            slug: z.string(),
          })
        ),
      })
    ),
  }),
  helpGlossary: z.object({
    entries: z.array(
      z.object({
        id,
        term: z.string(),
        description: z.string(),
        feature,
        tagSlugs,
        slug,
        shortDescription,
      })
    ),
  }),
  releaseNotes: z.array(
    z.object({
      id,
      releaseDate: z.string(),
      releaseDateUsFormat: z.string(),
      title: z.string(),
      slug: z.string(),
      body: z.string(),
      shortDescription: z.string(),
    })
  ),
  tags: z.array(
    z.object({
      typeSlug: z.string(),
      title: z.string(),
      slug: z.string(),
    })
  ),
  tagTypes: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      order: z.number(),
    })
  ),
  helpSearchHints: z.object({
    tiles: z.array(
      z.object({
        iconName: z.string(),
        title: z.string(),
        linkPath: z.string().nullable(),
        body: z.string().nullable(),
      })
    ),
  }),
  home: z.object({
    tiles: z.array(
      z.object({
        iconName: z.string(),
        title: z.string(),
        linkPath: z.string().nullable(),
        body: z.string().nullable(),
      })
    ),
  }),
  helpVideoCollections: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      videos: z.array(
        z.object({
          slug: z.string(),
        })
      ),
    })
  ),
  searchIndex: z.string(),
} as const;

export type SectionData = z.infer<typeof pages.helpSections>[number];
export type SubsectionData = z.infer<typeof pages.helpSubsections>[number];
export type FaqData = z.infer<typeof pages.helpFaqs>[number];
export type FaqEntryData = z.infer<
  typeof pages.helpFaqs
>[number]["entries"][number];
export type ArticleData = z.infer<typeof pages.helpArticles>[number];
export type VideoData = z.infer<typeof pages.helpVideos>[number];
export type SidebarData = z.infer<typeof pages.navSidebar>;
export type GlossaryData = z.infer<typeof pages.helpGlossary>;
export type ReleaseNotesData = z.infer<typeof pages.releaseNotes>[number];
export type TagData = z.infer<typeof pages.tags>[number];
export type TagTypeData = z.infer<typeof pages.tagTypes>[number];
