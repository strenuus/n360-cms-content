import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpArticlesQuery {
    allHelpArticle {
      nodes {
        sectionSlug
        subsectionSlug
        feature
        id
        title
        slug
        shortDescription
        body
        tagSlugs
      }
    }
  }
`;
