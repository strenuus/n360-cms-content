import { graphql } from "gatsby"

export default () => null

export const query = graphql`
  query LecacyHelpQuery {
    allLegacyHelpJson(sort: {fields: [order, title]}) {
      nodes {
        title
        sectionId
        feature
        placeholderId
        body
        faq {
          sections {
            title
            description
            entries {
              question
              answer
              feature
            }
          }
        }
        videos {
          title
          description
          fileName
          thumbnail
          thumbnailAltText
        }
      }
    }
  }
`
