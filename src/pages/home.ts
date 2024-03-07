import { graphql } from "gatsby"

export default () => null

export const query = graphql`
  query HomeQuery {
    homeJson {
      tiles {
        title
        iconName
        body
      }
    }
  }
`
