import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpSubsectionsQuery {
    allHelpSubsection {
      nodes {
        sectionSlug
        id
        title
        slug
        body
        tiles {
          iconName
          title
          linkPath
          body
        }
        feature
        tagSlugs
        shortDescription
      }
    }
  }
`;
