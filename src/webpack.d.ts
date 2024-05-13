declare module "cms/PageData" {
  const content: {
    data: {
      post: { html: string; frontmatter: { title: string; date: string } };
    };
  };

  export default content;
}

declare module "host/start" {
  import React from "react";

  export type ShellProps = {
    document?: Document;
    appLoader?: () => JSX.Element;
    fallback?: () => JSX.Element;
  };

  export const Shell: React.FC<ShellProps>;
}

declare module "host/helpCenter/cmsPreviewComponents" {
  import React from "react";

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

  export type DescriptionProps = {
    term: string;
    details: string;
    expanded?: boolean;
    toggle: () => void;
  };

  export const Description: React.FC<DescriptionProps>;

  export const MarkdownOutput: React.FC<{ html: string }>;

  export type PageData = {
    title?: string;
    body?: string;
    tiles?: TileData[];
  };

  export const HelpSectionPage: React.FC<{ page: PageData }>;

  type VideoData = {
    sectionSlug?: string;
    subsectionSlug?: string;
    feature?: string;
    title?: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
    url?: string;
    thumbnail?: string;
    duration?: {
      mm?: number;
      ss?: number;
    };
  };

  export const VideoTile: React.FC<{ video: VideoData }>;

  export const HelpVideoPage: React.FC<{ video: VideoData }>;

  type VideoCollectionProps = {
    collection: {
      slug?: string;
      videos?: {
        slug?: string;
      }[];
    };
    itemsPerPage?: number;
  };

  export const VideoCollection: React.FC<VideoCollectionProps>;

  type ArticleData = {
    sectionSlug?: string;
    subsectionSlug?: string;
    feature?: string;
    title?: string;
    slug?: string;
    shortDescription?: string;
    body?: string;
  };

  export const HelpArticlePage: React.FC<{ article: ArticleData }>;
}
