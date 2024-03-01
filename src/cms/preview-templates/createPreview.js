import { useEffect } from 'react'
import { shell } from "host/start"

export default function createPreview(component) {
  return (props) => {
    useEffect(() => {
      setUpPreviewPane(props.document)
    }, [props.document])

    return shell(() => component(props))
  }
}

const setUpPreviewPane = (document) => {
  document.body.id = "app"

  // const styleSelectors = [ 'style[data-emotion="css"]', 'link[rel="stylesheet"][href^="/assets"]', ]
  // const styles = window.top.document.querySelectorAll(styleSelectors.join(','));
  // styles.forEach((style) => {
  //   document.head.appendChild(style.cloneNode(true))
  // })

  const fontAwesome = document.createElement('script');
  fontAwesome.setAttribute('src', 'https://kit.fontawesome.com/74c5cf378a.js')
  fontAwesome.setAttribute('crossorigin', 'anonymous')
  document.head.appendChild(fontAwesome)
}
