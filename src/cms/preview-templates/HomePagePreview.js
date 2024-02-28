import React from 'react'
import { marked } from "marked"
import HomePage from '../../templates/home-page'
import createPreview from './createPreview'

const HomePagePreview = createPreview(({entry}) => {
  const { tiles } = entry.getIn(['data']).toJS()

  tiles.forEach(tile => {
    if (tile.body) tile.body = marked.parse(tile.body)
  })

  return <HomePage tiles={tiles} />
})

export default HomePagePreview
