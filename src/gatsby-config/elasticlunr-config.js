const helpCenter = "/help2";

const defaultFields = {
  title: (node) => node.title,
  description: (node) => node.shortDescription,
  feature: (node) => node.feature,
};

const getSection = (node, getNodesByType) =>
  getNodesByType("HelpSection").find(
    (section) => section.slug === node.sectionSlug
  );

const queryString = (obj) => new URLSearchParams(obj).toString();

const config = {
  fields: ["title", "feature", "description", "type"],
  resolvers: {
    HelpSection: {
      ...defaultFields,
      path: (node) => `${helpCenter}/${node.slug}`,
      type: () => "Section",
    },
    HelpSubsection: {
      ...defaultFields,
      path: (node) => `${helpCenter}/${node.sectionSlug}/${node.slug}`,
      type: (node, getNode, getNodesByType) =>
        getSection(node, getNodesByType).title,
    },
    HelpFaq: {
      ...defaultFields,
      path: (node) =>
        `${helpCenter}/faq/${node.sectionSlug}?${queryString({
          s: node.slug,
        })}`,
      type: () => "FAQ",
    },
    FaqEntry: {
      ...defaultFields,
      title: (entry) => entry.question,
      path: (entry, getNode) => {
        const faq = getNode(entry.parent);
        return `${helpCenter}/faq/${faq.sectionSlug}?${queryString({
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
        return `${helpCenter}/glossary?${queryString({
          s: firstLetter,
          t: entry.slug,
        })}`;
      },
      type: () => "Glossary",
    },
  },
  // Optional filter to limit indexed nodes
  // filter: (node, getNode) => node.frontmatter.tags !== "exempt",
};

export default config;
