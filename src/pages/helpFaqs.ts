import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpFaqsQuery {
    allHelpFaq {
      nodes {
        id
        sectionSlug
        feature
        title
        slug
        body
        entries: childrenFaqEntry {
          id
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
