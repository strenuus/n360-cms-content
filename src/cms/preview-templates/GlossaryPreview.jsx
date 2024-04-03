import React from 'react'
import { DescriptionList } from 'host/helpCenter/cmsPreviewComponents'
import { Layout } from './HelpCenterLayout'
import createPreview from './lib/createPreview'
import parseMarkdown from './lib/parseMarkdown'

const GlossaryPreview = createPreview(({entry, getAsset}) => {
  const entries = entry.getIn(['data', 'entries']).toJS()

  for (const entry of entries) {
    entry.description = parseMarkdown(entry.description, getAsset)
  }

  const descriptions = entries.map(e => ({term: e.term, details: e.description}))

  return <Layout>
    <DescriptionList descriptions={descriptions} expanded={true} />
  </Layout>
})

export default GlossaryPreview
