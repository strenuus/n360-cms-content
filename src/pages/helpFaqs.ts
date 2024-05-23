import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpFaqsQuery {
    allHelpFaq {
      nodes {
        sectionSlug
        feature
        title
        slug
        body
        entries {
          feature
          answer
          question
          slug
          tagSlugs
        }
      }
    }
  }
`;
