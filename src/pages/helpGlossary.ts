import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpFaqsQuery {
    helpGlossary {
      entries {
        term
        description
        feature
        slug
        tagSlugs
      }
    }
  }
`;
