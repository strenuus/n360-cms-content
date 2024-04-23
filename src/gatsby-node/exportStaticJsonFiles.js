import extractPageData from "./lib/extractPageData";

export default function exportStaticJsonFiles() {
  extractPageData("home", (data) => data.homeJson);
  extractPageData("helpSections", (data) => data.allHelpSectionsJson.nodes);
  extractPageData(
    "helpSubsections",
    (data) => data.allHelpSubsectionsJson.nodes
  );
  extractPageData("helpFaqs", (data) => data.allHelpFaqsJson.nodes);
  extractPageData("helpGlossary", (data) => data.helpGlossaryJson);
  extractPageData("legacyHelp", (data) => data.allLegacyHelpJson.nodes);
  extractPageData("searchIndex", (data) => data.siteSearchIndex?.index || null);
  extractPageData("navSidebar", (data) => {
    const sectionsData = data.allHelpSectionsJson.nodes;
    const subsectionsData = data.allHelpSubsectionsJson.nodes;
    const sidebar = data.navSidebarJson;

    for (const section of sidebar.sections) {
      const sectionData = sectionsData.find(
        (data) => data.slug === section.slug
      );
      section.title = sectionData.title;

      if (!Array.isArray(section.subsections)) continue;

      for (const subsection of section.subsections) {
        const subsectionData = subsectionsData.find(
          (data) => data.slug === subsection.slug
        );
        subsection.title = subsectionData.title;
      }
    }

    return sidebar;
  });
}
