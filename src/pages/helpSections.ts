import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpSectionsQuery {
    allHelpSection {
      nodes {
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
