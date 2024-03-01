import CMS from 'decap-cms-app'
import HomePagePreview from './preview-templates/HomePagePreview'

CMS.registerPreviewTemplate('home', HomePagePreview)

CMS.registerPreviewStyle('./preview-pane.css')
