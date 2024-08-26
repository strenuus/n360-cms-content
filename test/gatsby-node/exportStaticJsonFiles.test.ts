// @ts-nocheck

import * as fs from "fs";
import * as path from "path";
import { readPageData, pages } from "../../src/gatsby-node/lib/pageData";
import exportStaticJsonFiles from "../../src/gatsby-node/exportStaticJsonFiles";

const pageDataDir = path.resolve(__dirname, "./../public/page-data");
const outputDir = path.resolve(__dirname, "./../../tmp/test/public/data");

describe("Static JSON Data", () => {
  let input;
  let output;

  beforeAll(() => {
    const keys = Object.keys(pages).filter((k) => k !== "searchIndex");
    input = Object.fromEntries(
      keys.map((k) => [k, readPageData(k, pageDataDir)])
    );

    exportStaticJsonFiles(pageDataDir, outputDir);
    output = readJsonFiles(outputDir);
  });

  test("should not include orphaned faqs", () => {
    expect(input.helpFaqs.map((faq) => faq.slug).toSorted()).toEqual([
      "beginner-faq",
      "orphaned-faq",
      "tagged-faq",
    ]);

    expect(output.helpFaqs.map((faq) => faq.slug).toSorted()).toEqual([
      "beginner-faq",
      "tagged-faq",
    ]);
  });

  test("should not include orphaned articles", () => {
    expect(input.helpArticles.map((a) => a.slug).toSorted()).toEqual([
      "directly-orphaned-article",
      "indirectly-orphaned-article",
      "managing-users",
      "tagged-article",
    ]);

    expect(output.helpArticles.map((a) => a.slug).toSorted()).toEqual([
      "managing-users",
      "tagged-article",
    ]);
  });

  test("should not include orphaned videos", () => {
    expect(input.helpVideos.map((v) => v.slug).toSorted()).toEqual([
      "directly-orphaned-video",
      "indirectly-orphaned-video",
      "just-a-video",
      "tagged-video",
    ]);

    expect(output.helpVideos.map((v) => v.slug).toSorted()).toEqual([
      "just-a-video",
      "tagged-video",
    ]);
  });

  test("resources should inherit feature restrictions from parents", () => {
    const section = input.helpSections.find(
      ({ slug }) => slug === "using-network360"
    );
    expect(section.feature).toEqual("healthcare_intelligence");

    const inSubsection = input.helpSubsections.find(
      ({ slug }) => slug === "admin"
    );
    expect(inSubsection.feature).toEqual("role:client_admin");

    const inArticle = input.helpArticles.find(
      ({ slug }) => slug === "managing-users"
    );
    expect(inArticle.feature).toEqual("manage_users");

    const outSubsection = output.helpSubsections.find(
      ({ slug }) => slug === "admin"
    );
    expect(outSubsection.features.toSorted()).toEqual([
      "healthcare_intelligence",
      "role:client_admin",
    ]);

    const outArticle = output.helpArticles.find(
      ({ slug }) => slug === "managing-users"
    );
    expect(outArticle.features.toSorted()).toEqual([
      "healthcare_intelligence",
      "manage_users",
      "role:client_admin",
    ]);
  });

  test("sidebar should not reference missing sections", () => {
    expect(input.navSidebar.sections.map((s) => s.slug).toSorted()).toEqual([
      "faq",
      "missing-section",
      "using-network360",
    ]);

    expect(output.navSidebar.sections.map((s) => s.slug).toSorted()).toEqual([
      "faq",
      "using-network360",
    ]);
  });

  test("sidebar should not reference missing subsections", () => {
    const inFaq = input.navSidebar.sections.find((s) => s.slug === "faq");
    expect(inFaq.subsections.map((s) => s.slug).toSorted()).toEqual([
      "faq-section",
      "missing-faq-section",
    ]);

    const outFaq = output.navSidebar.sections.find((s) => s.slug === "faq");
    expect(outFaq.subsections.map((s) => s.slug)).toEqual(["faq-section"]);
  });

  test("tags should not include orphaned tags", () => {
    expect(input.tags.map((t) => t.slug).toSorted()).toEqual([
      "account-management",
      "administrators",
      "advanced-users",
      "billing",
      "developers",
      "faq",
      "high-priority",
      "low-priority",
      "medium-priority",
      "new-users",
      "product-features",
      "release-notes",
      "technical-support",
      "troubleshooting-guide",
      "tutorial",
      "urgent",
    ]);

    expect(output.tags.map((t) => t.slug).toSorted()).toEqual([
      "account-management",
      "administrators",
      "advanced-users",
      "billing",
      "developers",
      "faq",
      "new-users",
      "product-features",
      "release-notes",
      "technical-support",
      "troubleshooting-guide",
      "tutorial",
    ]);
  });

  test("sections should not reference missing or orphaned tags", () => {
    const inSection = input.helpSections.find(
      (s) => s.slug === "tagged-section"
    );

    expect(inSection.tagSlugs.toSorted()).toEqual([
      "account-management",
      "high-priority",
      "missing-tag",
    ]);

    const outSection = output.helpSections.find(
      (s) => s.slug === "tagged-section"
    );

    expect(outSection.tagSlugs.toSorted()).toEqual(["account-management"]);
  });

  test("subsections should not reference missing or orphaned tags", () => {
    const inSubsection = input.helpSubsections.find(
      (s) => s.slug === "tagged-subsection"
    );

    expect(inSubsection.tagSlugs.toSorted()).toEqual([
      "account-management",
      "high-priority",
      "missing-tag",
    ]);

    const outSubsection = output.helpSubsections.find(
      (s) => s.slug === "tagged-subsection"
    );

    expect(outSubsection.tagSlugs.toSorted()).toEqual(["account-management"]);
  });

  test("faq entries should not reference missing or orphaned tags", () => {
    const inEntry = input.helpFaqs
      .find((faq) => faq.slug === "tagged-faq")
      .entries.find((e) => e.slug === "tagged-question");

    expect(inEntry.tagSlugs.toSorted()).toEqual([
      "account-management",
      "high-priority",
      "missing-tag",
    ]);

    const outEntry = output.helpFaqs
      .find((faq) => faq.slug === "tagged-faq")
      .entries.find((e) => e.slug === "tagged-question");

    expect(outEntry.tagSlugs.toSorted()).toEqual(["account-management"]);
  });

  test("glossary entries should not reference missing or orphaned tags", () => {
    const inEntry = input.helpGlossary.entries.find(
      (e) => e.slug === "tagged-glossary-entry"
    );

    expect(inEntry.tagSlugs.toSorted()).toEqual([
      "account-management",
      "high-priority",
      "missing-tag",
    ]);

    const outEntry = output.helpGlossary.entries.find(
      (e) => e.slug === "tagged-glossary-entry"
    );

    expect(outEntry.tagSlugs.toSorted()).toEqual(["account-management"]);
  });

  test("articles should not reference missing or orphaned tags", () => {
    const inArticle = input.helpArticles.find(
      (a) => a.slug === "tagged-article"
    );

    expect(inArticle.tagSlugs.toSorted()).toEqual([
      "account-management",
      "high-priority",
      "missing-tag",
    ]);

    const outArticle = output.helpArticles.find(
      (a) => a.slug === "tagged-article"
    );

    expect(outArticle.tagSlugs).toEqual(["account-management"]);
  });

  test("videos should not reference missing or orphaned tags", () => {
    const inVideo = input.helpVideos.find((v) => v.slug === "tagged-video");

    expect(inVideo.tagSlugs.toSorted()).toEqual([
      "account-management",
      "high-priority",
      "missing-tag",
    ]);

    const outVideo = output.helpVideos.find((v) => v.slug === "tagged-video");
    expect(outVideo.tagSlugs.toSorted()).toEqual(["account-management"]);
  });
});

function readJsonFiles(directory) {
  return fs
    .readdirSync(directory)
    .filter((file) => path.extname(file) === ".json")
    .reduce((data, file) => {
      const filePath = path.join(directory, file);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const fileNameWithoutExtension = path.basename(file, ".json");
      data[fileNameWithoutExtension] = JSON.parse(fileContents);
      return data;
    }, {});
}
