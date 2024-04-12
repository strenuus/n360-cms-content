import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpSubsectionsQuery {
    allHelpSubsectionsJson {
      nodes {
        sectionSlug
        title
        slug
        body
        tiles {
          iconName
          title
          linkPath
          body
        }
      }
    }
  }
`;
