declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    netlifyIdentity: any;
    DecapCmsApp: any;
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import netlifyIdentity from 'netlify-identity-widget';
import DecapCmsApp from 'decap-cms-app';

window.React = React;
window.ReactDOM = ReactDOM;
window.netlifyIdentity = netlifyIdentity;
window.DecapCmsApp = DecapCmsApp;

const cmsScript = document.createElement('script');
cmsScript.src = 'cms.js';
cmsScript.defer = true;
document.head.appendChild(cmsScript);

import HomePagePreview from './preview-templates/HomePagePreview'
DecapCmsApp.registerPreviewTemplate('home', HomePagePreview)
