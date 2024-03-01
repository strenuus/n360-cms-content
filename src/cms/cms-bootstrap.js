import CMS from 'decap-cms-app'
import HomePagePreview from './preview-templates/HomePagePreview'

CMS.registerPreviewStyle('./preview-pane.css')

CMS.registerPreviewTemplate('home', HomePagePreview)
