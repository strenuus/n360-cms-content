import { Shell } from "host/start"

import { useState, useLayoutEffect } from 'react'

export default function createPreview(component) {
  return (props) => {
    setPreviewPaneId(props)
    setUpFontAwesome(props)
    ignoreLinksAndButtons(props)
    moveStylesToPreviewPane(props)

    return <Shell renderApp={() => component(props)} />
  }
}

const setPreviewPaneId = ({document}) => {
  useLayoutEffect(() => {
    const oldId = document.body.getAttribute("id")
    document.body.setAttribute("id", "app")

    return () => document.body.setAttribute("id", oldId)
  }, [])
}

const setUpFontAwesome = ({document}) => {
  useLayoutEffect(() => {
    const fontAwesome = document.createElement('script')
    fontAwesome.setAttribute('src', 'https://kit.fontawesome.com/74c5cf378a.js')
    fontAwesome.setAttribute('crossorigin', 'anonymous')
    document.head.appendChild(fontAwesome)

    return () => document.head.removeChild(fontAwesome)
  }, [])
}

const ignoreLinksAndButtons = ({document}) => {
  useLayoutEffect(() => {
    const handler = event => {
      if (["A", "BUTTON"].includes(event.target.tagName)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.body.addEventListener("click", handler)

    return () => document.body.removeEventListener("click", handler)
  }, [])
}

const moveStylesToPreviewPane = ({window}) => {
  // After importing 'start' from N360, the N360 styles are appended to the main window,
  // where they do not affect the iframe containing the preview pane (the only place they should affect).
  // Since the styles are not there initially, we need to watch for them and move them as they are created.
  // (We do want to move them, not copy them, as we do not want them affecting the main CMS interface).

  const mainHead = window.parent.document.head
  const iframeHead = window.document.head

  const isStylesheet = (node) => node.tagName === 'LINK' && node.rel === 'stylesheet'
  const isStyleTag = (node) => node.tagName === 'STYLE'

  const onMutation = function(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (isStylesheet(node) || isStyleTag(node)) {
          iframeHead.appendChild(node)
        }
      }
    }
  }

  useMutationObserver(mainHead, onMutation);
}

function useMutationObserver(target, onMutation) {
  const [observer, setObserver] = useState(null);

  useLayoutEffect(() => {
    if (observer == null) {
      setObserver(new MutationObserver(onMutation))
    } else {
      observer.observe(target, { childList: true, subtree: true });
    }

    return () => { if (observer) observer.disconnect() }
  }, [observer, target, onMutation]);
}

