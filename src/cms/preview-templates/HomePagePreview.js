import React from 'react'
import { marked } from "marked"
import HomePage from '../../templates/home-page'

const HomePagePreview = ({ entry }) => {
  const { tiles } = entry.getIn(['data']).toJS()

  tiles.forEach(tile => {
    if (tile.body) tile.body = marked.parse(tile.body)
  })

  return <HomePage tiles={tiles} />
}

export default HomePagePreview
