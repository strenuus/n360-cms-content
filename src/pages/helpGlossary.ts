import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpGlossaryQuery {
    helpGlossary {
      entries: childrenGlossaryEntry {
        id
        term
        description
        feature
        slug
        tagSlugs
        shortDescription
      }
    }
  }
`;
