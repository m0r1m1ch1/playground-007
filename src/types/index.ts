export type PageInfo = {
  slug: string;
  title: string;
  description: string;
  children: PageInfo[];
  isHome?: boolean;
  isNoindex?: boolean;
};

export type BreadcrumbItem = {
  path?: string;
  title: string;
};

export type BaseImageProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type BaseLinkProps = {
  href: string;
  target?: '_blank' | '_self';
};

export type MediaQueryType = 'mobile' | 'tablet' | 'desktop';

export type SiteMapNavItem = BaseLinkProps & {
  text: string;
  children?: SiteMapNavItem[];
};
