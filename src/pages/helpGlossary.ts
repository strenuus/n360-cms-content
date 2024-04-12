import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpFaqsQuery {
    helpGlossaryJson {
      entries {
        term
        description
        feature
      }
    }
  }
`;
