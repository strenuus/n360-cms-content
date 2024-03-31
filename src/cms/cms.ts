import React from 'react';
import ReactDOM from 'react-dom';
import netlifyIdentity from 'netlify-identity-widget';
import DecapCmsApp from 'decap-cms-app';

import HomePagePreview from './preview-templates/HomePagePreview'
import slugifyTitle from './lib/slugifyTitle';
import ReadOnlyWidget from './lib/ReadOnlyWidget';

declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    netlifyIdentity: any;
    DecapCmsApp: any;
  }
}

window.React = React;
window.ReactDOM = ReactDOM;
window.netlifyIdentity = netlifyIdentity;
window.DecapCmsApp = DecapCmsApp;

const cmsScript = document.createElement('script');
cmsScript.src = 'cms.js';
cmsScript.defer = true;
document.head.appendChild(cmsScript);

DecapCmsApp.registerPreviewTemplate('home', HomePagePreview)

DecapCmsApp.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    entry = slugifyTitle(entry);

    return entry.get("data");
  },
});

DecapCmsApp.registerWidget("readonly", ReadOnlyWidget);
