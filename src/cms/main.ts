import React from "react";
import ReactDOM from "react-dom";
import netlifyIdentity from "netlify-identity-widget";
import DecapCmsApp from "decap-cms-app";
import slugifyTitle from "./lib/slugifyTitle";
import ReadOnlyWidget from "./lib/ReadOnlyWidget";
import HomePagePreview from "./preview-templates/HomePagePreview";
import FaqSectionPreview from "./preview-templates/FaqSectionPreview";
import HelpSectionPreview from "./preview-templates/HelpSectionPreview";
import GlossaryPreview from "./preview-templates/GlossaryPreview";

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

DecapCmsApp.registerEventListener({
  name: "preSave",
  handler: ({ entry }) => {
    entry = slugifyTitle(entry);

    return entry.get("data");
  },
});

DecapCmsApp.registerWidget("readonly", ReadOnlyWidget);

DecapCmsApp.registerPreviewTemplate("home", HomePagePreview);
DecapCmsApp.registerPreviewTemplate("helpFaqs", FaqSectionPreview);
DecapCmsApp.registerPreviewTemplate("helpGlossary", GlossaryPreview);
DecapCmsApp.registerPreviewTemplate("helpSections", HelpSectionPreview);
DecapCmsApp.registerPreviewTemplate("helpFaqSections", HelpSectionPreview);
DecapCmsApp.registerPreviewTemplate("helpSubsections", HelpSectionPreview);
