declare module "cms/PageData" {
  const content: {
    data: {
      post: { html: string; frontmatter: { title: string; date: string } }
    }
  }
  export default content
}
