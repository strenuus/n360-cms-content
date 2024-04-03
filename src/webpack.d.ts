declare module "cms/PageData" {
  const content: {
    data: {
      post: { html: string; frontmatter: { title: string; date: string } }
    }
  }

  export default content
}

declare module "host/start" {
  import React from 'react';

  export type ShellProps = {
    document?: Document;
    appLoader?: () => JSX.Element;
    fallback?: () => JSX.Element;
  }

  export const Shell: React.FC<ShellProps>;
}

declare module "host/helpCenter/cmsPreviewComponents" {
  import React from 'react';

  export type TileData = {
    iconName?: string;
    title?: string;
    linkPath?: string;
    body?: string;
  };

  export type TilesProps = {
    tiles: TileData[];
    horizontalHeaders?: boolean;
    columns?: number;
  };

  export const Tiles: React.FC<TilesProps>;

  export type FaqEntry = {
    question?: string;
    answer?: string;
    feature?: string;
  }

  export type FaqSectionData = {
    sectionSlug?: string;
    feature?: string;
    title?: string;
    slug?: string;
    body?: string;
    entries?: FaqEntry[];
  }

  export const FaqSection: React.FC<{ data: FaqSectionData }>;

  export type GlossaryEntry = {
    term?: string;
    description?: string;
    feature?: string;
  }

  export const Glossary: React.FC<{ entries: GlossaryEntry[] }>;

  export type Description = {
    term: string;
    details: string;
  }

  export const DescriptionList: React.FC<{ descriptions: Description[], expanded?: boolean }>;

  export const MarkdownOutput: React.FC<{ html: string }>;

  export type PageData = {
    title?: string;
    body?: string;
    tiles?: TileData[];
  };

  export const HelpSectionPage: React.FC<{ page: PageData }>;
}
