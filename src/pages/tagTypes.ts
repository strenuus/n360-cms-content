import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query TagTypesQuery {
    allTagType {
      nodes {
        title
        slug
      }
    }
  }
`;
