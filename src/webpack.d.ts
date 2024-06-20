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
    MarkdownOutput?: MarkdownOutputComponent;
  };

  export const Tiles: React.FC<TilesProps>;

  export type DescriptionProps = {
    term: string;
    details: string;
    expanded?: boolean;
    toggle: () => void;
  };

  export const Description: React.FC<DescriptionProps>;

  export type BuildWidget = (
    tagName: string,
    dataset: DOMStringMap
  ) => JSX.Element;

  export const MarkdownOutput: React.FC<{
    html: string;
    buildWidget: BuildWidget;
  }>;

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

  export const StartTour: React.FC<{ text: string | undefined }>;

  export const Pagination: React.FC<{ props }>;

  type BadgeProps = {
    colorClass?: string;
    textClass?: string;
    text: string;
    linkPath?: string;
    className?: string;
    style?: CSSProperties;
  };

  export const Badge: React.FC<BadgeProps>;

  export const RelatedContentButton: React.FC;

  type AccordionProps = {
    summary: string;
    details: unknown;
    expanded?: boolean;
  };

  export const Accordion: React.FC<AccordionProps>;
}
