import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpSearchHintsQuery {
    helpSearchHintsJson {
      tiles {
        title
        linkPath
        iconName
        body
      }
    }
  }
`;
