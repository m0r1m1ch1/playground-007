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

export type NavItem = BaseLinkProps & {
  text: string;
  children?: NavItem[];
};

declare global {
  interface SwupHookHandler {
    (visit: any): void | Promise<void>;
  }

  interface SwupEnableHandler {
    (): void;
  }

  interface SwupHookOptions {
    once?: boolean;
    priority?: number;
    before?: boolean;
  }

  interface Window {
    swup?: {
      hooks: {
        on: (hook: string, handler: SwupHookHandler, options?: SwupHookOptions) => void;
        off: (hook: string, handler: SwupHookHandler) => void;
        before: (hook: string, handler: SwupHookHandler, options?: SwupHookOptions) => void;
        replace: (hook: string, handler: SwupHookHandler, options?: SwupHookOptions) => void;
      };
      findPlugin: (plugin: string) => any;
    };
  }
}
