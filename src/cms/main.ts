import React from "react";
import ReactDOM from "react-dom";
import netlifyIdentity from "netlify-identity-widget";
import DecapCmsApp from "decap-cms-app";
import HomePagePreview from "./preview-templates/HomePagePreview";
import FaqSectionPreview from "./preview-templates/FaqSectionPreview";
import HelpSectionPreview from "./preview-templates/HelpSectionPreview";
import GlossaryPreview from "./preview-templates/GlossaryPreview";
import VideoCollectionPreview from "./preview-templates/VideoCollectionPreview";
import VideoPagePreview from "./preview-templates/VideoPagePreview";
import ArticlePagePreview from "./preview-templates/ArticlePagePreview";

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

DecapCmsApp.registerPreviewTemplate("home", HomePagePreview);
DecapCmsApp.registerPreviewTemplate("helpSearchHints", HomePagePreview);
DecapCmsApp.registerPreviewTemplate("helpFaqs", FaqSectionPreview);
DecapCmsApp.registerPreviewTemplate("helpGlossary", GlossaryPreview);
DecapCmsApp.registerPreviewTemplate("helpSections", HelpSectionPreview);
DecapCmsApp.registerPreviewTemplate("helpFaqSections", HelpSectionPreview);
DecapCmsApp.registerPreviewTemplate("helpSubsections", HelpSectionPreview);
DecapCmsApp.registerPreviewTemplate("helpArticles", ArticlePagePreview);
DecapCmsApp.registerPreviewTemplate("helpVideos", VideoPagePreview);
DecapCmsApp.registerPreviewTemplate(
  "helpVideoCollections",
  VideoCollectionPreview
);
