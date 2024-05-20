import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query HelpSectionsQuery {
    allHelpVideoCollection {
      nodes {
        title
        slug
        videos {
          slug
        }
      }
    }
  }
`;
