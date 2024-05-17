import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query TagsQuery {
    allTag {
      nodes {
        typeSlug
        title
        slug
      }
    }
  }
`;
