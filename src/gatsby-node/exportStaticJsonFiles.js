import extractPageData from "./lib/extractPageData";

export default function exportStaticJsonFiles() {
  extractPageData("home", (data) => data.homeJson);
  extractPageData("helpSections", (data) => data.allHelpSection.nodes);
  extractPageData("helpSubsections", (data) => data.allHelpSubsection.nodes);
  extractPageData("helpVideos", (data) => data.allHelpVideo.nodes);
  extractPageData("helpFaqs", (data) => data.allHelpFaq.nodes);
  extractPageData("helpGlossary", (data) => data.helpGlossary);
  extractPageData("legacyHelp", (data) => data.allLegacyHelpJson.nodes);
  extractPageData("searchIndex", (data) => data.siteSearchIndex?.index || null);
  extractPageData("helpSearchHints", (data) => data.helpSearchHintsJson);
  extractPageData("navSidebar", (data) => {
    const sectionsData = data.allHelpSection.nodes;
    const subsectionsData = data.allHelpSubsection.nodes;
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
