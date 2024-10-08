import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpVideosQuery {
    allHelpVideo {
      nodes {
        sectionSlug
        subsectionSlug
        feature
        id
        title
        slug
        shortDescription
        description
        url
        thumbnail
        duration {
          mm
          ss
        }
        tagSlugs
      }
    }
  }
`;
