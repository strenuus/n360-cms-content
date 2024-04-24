import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query SearchIndexQuery {
    siteSearchIndex {
      index
    }
  }
`;
