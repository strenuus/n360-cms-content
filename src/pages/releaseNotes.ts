import { graphql } from "gatsby";

const page = () => null;
export default page;

export const query = graphql`
  query ReleaseNotesQuery {
    allReleaseNotes {
      nodes {
        releaseDate
        releaseDateUsFormat
        title
        slug
        body
      }
    }
  }
`;
