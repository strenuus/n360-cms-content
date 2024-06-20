import React from "react";
import ReactDOM from "react-dom";
import netlifyIdentity from "netlify-identity-widget";
import DecapCmsApp from "decap-cms-app";
import PagePreview from "./preview-templates/PagePreview";
import FaqSectionPreview from "./preview-templates/FaqSectionPreview";
import GlossaryPreview from "./preview-templates/GlossaryPreview";
import VideoPagePreview from "./preview-templates/VideoPagePreview";
import ReleaseNotesPreview from "./preview-templates/ReleaseNotesPreview";

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

const cmsScript = document.createElement("script");
cmsScript.src = "cms.js";
cmsScript.defer = true;
document.head.appendChild(cmsScript);

DecapCmsApp.registerPreviewTemplate("home", PagePreview);
DecapCmsApp.registerPreviewTemplate("helpSearchHints", PagePreview);
DecapCmsApp.registerPreviewTemplate("helpSections", PagePreview);
DecapCmsApp.registerPreviewTemplate("helpFaqSections", PagePreview);
DecapCmsApp.registerPreviewTemplate("helpSubsections", PagePreview);
DecapCmsApp.registerPreviewTemplate("helpArticles", PagePreview);

DecapCmsApp.registerPreviewTemplate("helpFaqs", FaqSectionPreview);
DecapCmsApp.registerPreviewTemplate("helpGlossary", GlossaryPreview);
DecapCmsApp.registerPreviewTemplate("releaseNotes", ReleaseNotesPreview);

DecapCmsApp.registerPreviewTemplate("helpVideos", VideoPagePreview);
