import { useEffect } from 'react'

export default function createPreview(component) {
  return (props) => {
    useEffect(() => {
      injectPreviewPaneDependencies(props.document)
    }, [props.document])

    return component(props)
  }
}

const injectPreviewPaneDependencies = (document) => {
  const fontAwesome = document.createElement('script');
  fontAwesome.setAttribute('src', 'https://kit.fontawesome.com/74c5cf378a.js')
  fontAwesome.setAttribute('crossorigin', 'anonymous')
  document.head.appendChild(fontAwesome)

  const init = document.createElement('script');
  init.setAttribute('src', 'preview-pane.js')
  init.setAttribute('crossorigin', 'anonymous')
  document.head.appendChild(init)
}
