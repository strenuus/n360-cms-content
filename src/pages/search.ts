import { graphql } from "gatsby"

export default () => null

export const query = graphql`
  query SearchIndexQuery {
    siteSearchIndex {
      index
    }
  }
`
