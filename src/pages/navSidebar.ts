import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query NavSidebarQuery {
    navSidebarJson {
      sections {
        iconName
        slug
        subsections {
          slug
        }
      }
    }
    allHelpSection {
      nodes {
        title
        slug
      }
    }
    allHelpSubsection {
      nodes {
        title
        slug
      }
    }
  }
`;
