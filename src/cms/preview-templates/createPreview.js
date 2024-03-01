import { useEffect } from 'react'
import Shell from "host/Shell"

export default function createPreview(component) {
  return (props) => {
    useEffect(() => {
      injectPreviewPaneDependencies(props.document)
    }, [props.document])

    return <Shell renderApp={() => component(props) } />
  }
}

const injectPreviewPaneDependencies = (document) => {
  const fontAwesome = document.createElement('script');
  fontAwesome.setAttribute('src', 'https://kit.fontawesome.com/74c5cf378a.js')
  fontAwesome.setAttribute('crossorigin', 'anonymous')
  document.head.appendChild(fontAwesome)
}
