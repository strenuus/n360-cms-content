import * as React from "react"
import Bio from "./bio"

type Post = { html: string; frontmatter: { title: string; date: string } }

export default function Article(props: { post: Post }) {
  const { post } = props

  return (
    <article
      className="blog-post"
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline">{post.frontmatter.title}</h1>
        <p>{post.frontmatter.date}</p>
      </header>
      <section
        dangerouslySetInnerHTML={{ __html: post.html }}
        itemProp="articleBody"
      />
      <hr />
      <footer>
        <Bio />
      </footer>
    </article>
  )
}
