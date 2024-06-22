import markdown from "marked";

// Delaring types helps to avoid errors when querying optional fields
// which are not always represented in the data.
//
export default function createGraphqlTypes({
  actions: { createTypes, createFieldExtension },
}) {
  createFieldExtension({
    name: "markdown",
    extend: () => ({
      resolve: (source, args, context, info) =>
        markdown.parse(source[info.fieldName] || ""),
    }),
  });

  createTypes(`
    type Tile {
      iconName: String
      title: String
      linkPath: String
      body: String @markdown
    }

    type HomeJson implements Node {
      tiles: [Tile]
    }

    type HelpSearchHintsJson implements Node {
      tiles: [Tile]
    }

    type HelpSection implements Node {
      title: String
      slug: String
      body: String @markdown
      tiles: [Tile]
      shortDescription: String
      feature: String
      tagSlugs: [String]
    }

    type HelpSubsection implements Node {
      sectionSlug: String
      title: String
      slug: String
      body: String @markdown
      tiles: [Tile]
      shortDescription: String
      feature: String
      tagSlugs: [String]
    }

    type HelpFaq implements Node {
      sectionSlug: String
      title: String
      slug: String
      feature: String
      body: String @markdown
      childrenFaqEntry: [FaqEntry]
      shortDescription: String
    }

    type FaqEntry implements Node {
      question: String
      answer: String @markdown
      slug: String
      feature: String
      tagSlugs: [String]
    }

    type HelpGlossary implements Node {
      childrenGlossaryEntry: [GlossaryEntry]
    }

    type GlossaryEntry implements Node {
      term: String
      description: String @markdown
      slug: String
      shortDescription: String
      feature: String
      tagSlugs: [String]
    }

    type HelpVideo implements Node {
      sectionSlug: String
      subsectionSlug: String
      title: String
      slug: String
      shortDescription: String
      description: String @markdown
      url: String
      thumbnail: String
      duration: HelpVideoDuration
      feature: String
      tagSlugs: [String]
    }

    type HelpVideoDuration {
      mm: Int
      ss: Int
    }

    type HelpVideoCollection implements Node {
      title: String
      slug: String
      videos: [HelpVideoCollectionVideo]
    }

    type HelpVideoCollectionVideo {
      slug: String
    }

    type HelpArticle implements Node {
      sectionSlug: String
      subsectionSlug: String
      title: String
      slug: String
      shortDescription: String
      body: String @markdown
      feature: String
      tagSlugs: [String]
    }

    type ReleaseNotes implements Node {
      releaseDate: String
      releaseDateUsFormat: String
      title: String
      slug: String
      shortDescription: String
      body: String @markdown
      tagSlugs: [String]
    }

    type TagType implements Node {
      title: String
      slug: String
      order: Int
    }

    type Tag implements Node {
      typeSlug: String
      title: String
      slug: String
    }
  `);
}
