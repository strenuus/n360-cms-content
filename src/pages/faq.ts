import { graphql } from "gatsby"

export default () => null

export const query = graphql`
  query FaqQuery {
    file(relativePath: { eq: "faq.yml" }) {
      yaml: childPagesYaml {
        id
        title
        description
        subtopics {
          subtopic
          questions {
            question
            answer
          }
        }
      }
    }
  }
`
