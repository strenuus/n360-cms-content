const helpCenter = "/help";

const defaultFields = {
  title: (node) => node.title,
  description: (node) => node.shortDescription,
  feature: (node) => node.feature,
  tagSlugs: (node) => node.tagSlugs || [],
};

const getSection = (node, getNodesByType) =>
  getNodesByType("HelpSection").find(
    (section) => section.slug === node.sectionSlug
  );

const getSubsection = (node, getNodesByType) =>
  getNodesByType("HelpSubsection").find(
    (subsection) => subsection.slug === node.subsectionSlug
  );

const queryString = (obj) => new URLSearchParams(obj).toString();

const dynamicPath = (subdir, node, getNodesByType) => {
  if (node.subsectionSlug) {
    const subsection = getSubsection(node, getNodesByType);
    return `${helpCenter}/sections/${subsection.sectionSlug}/sections/${subsection.slug}/${subdir}/${node.slug}`;
  } else if (node.sectionSlug) {
    return `${helpCenter}/sections/${node.sectionSlug}/${subdir}/${node.slug}`;
  } else {
    return `${helpCenter}/${subdir}/${node.slug}`;
  }
};

const config = {
  fields: ["title", "feature", "description", "type", "tagSlugs"],
  resolvers: {
    HelpSection: {
      ...defaultFields,
      path: (node) => `${helpCenter}/sections/${node.slug}`,
      type: () => "Section",
    },
    HelpSubsection: {
      ...defaultFields,
      path: (node) =>
        `${helpCenter}/sections/${node.sectionSlug}/sections/${node.slug}`,
      type: (node, getNode, getNodesByType) =>
        getSection(node, getNodesByType).title,
    },
    HelpFaq: {
      ...defaultFields,
      path: (node) =>
        `${helpCenter}/sections/faq/sections/${node.sectionSlug}?${queryString({
          s: node.slug,
        })}`,
      type: () => "FAQ",
    },
    FaqEntry: {
      ...defaultFields,
      title: (entry) => entry.question,
      path: (entry, getNode) => {
        const faq = getNode(entry.parent);
        return `${helpCenter}/sections/faq/sections/${
          faq.sectionSlug
        }?${queryString({
          s: faq.slug,
          q: entry.slug,
        })}`;
      },
      type: () => "FAQ",
    },
    GlossaryEntry: {
      ...defaultFields,
      title: (entry) => entry.term,
      path: (entry) => {
        const firstLetter = entry.slug[0];
        return `${helpCenter}/sections/glossary?${queryString({
          s: firstLetter,
          t: entry.slug,
        })}`;
      },
      type: () => "Glossary",
    },
    HelpVideo: {
      ...defaultFields,
      thumbnail: (video) => video.thumbnail,
      duration: (video) => video.duration,
      path: (node, getNode, getNodesByType) =>
        dynamicPath("videos", node, getNodesByType),
      type: () => "Video",
    },
    HelpArticle: {
      ...defaultFields,
      path: (node, getNode, getNodesByType) =>
        dynamicPath("articles", node, getNodesByType),
      type: () => "Article",
    },
    ReleaseNotes: {
      ...defaultFields,
      title: (node) => node.title,
      description: (node) => node.shortDescription,
      feature: () => null,
      path: (entry) => {
        return `${helpCenter}/sections/whats-new/sections/release-notes?${queryString(
          {
            date: entry.slug,
          }
        )}`;
      },
      type: () => "Release Notes",
    },
  },
  // Optional filter to limit indexed nodes
  // filter: (node, getNode) => node.frontmatter.tags !== "exempt",
};

export default config;
