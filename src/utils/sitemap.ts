import type { PageInfo, BreadcrumbItem } from '../types';

export const SITE_NAME = import.meta.env.SITE_NAME;
export const SITE_URL = import.meta.env.SITE_URL;

export const sitemapJson: PageInfo[] = [
  {
    slug: '',
    title: '',
    description: '',
    isHome: true,
    children: [
      {
        slug: 'about',
        title: '',
        description: '',
        children: [],
      },
    ],
  },
];

export const getPageInfoArray = (path: string, customPageInfo?: PageInfo | null): PageInfo[] => {
  const paths = path.split('/');
  if (paths[paths.length - 1] === '') {
    paths.pop();
  }

  if (customPageInfo) {
    paths.pop();
  }

  let breadcrumb: PageInfo[] = [];

  paths.forEach((path, index) => {
    let target: PageInfo = {
      slug: '',
      title: '',
      description: '',
      isHome: undefined,
      children: [],
    };
    const _target =
      index === 0
        ? sitemapJson.find((page) => page.slug === path)
        : breadcrumb[index - 1].children.find((page: any) => page.slug === path);
    if (_target) {
      target = _target;
    }
    breadcrumb.push(target);
  });

  if (customPageInfo) {
    breadcrumb.push(customPageInfo);
  }

  if (breadcrumb.length > 1 && breadcrumb[breadcrumb.length - 1].title === '') {
    const index = 0;
    const notFound = {
      slug: '404',
      title: 'ご指定のページが見つかりませんでした',
      description:
        '指定されたページは見つかりませんでした。ページが移動または削除されたか、URLが間違っている可能性がございます。',
      isNoindex: true,
      children: [],
    };
    breadcrumb = [breadcrumb[index], notFound];
  }

  return JSON.parse(JSON.stringify(breadcrumb));
};

export const getPageInfo = (path: string): PageInfo => {
  const pageInfoArray = getPageInfoArray(path);

  return pageInfoArray[pageInfoArray.length - 1];
};

export const getBreadcrumb = (path: string, customPageInfo?: PageInfo | null): BreadcrumbItem[] => {
  const breadcrumb = getPageInfoArray(path, customPageInfo);

  return breadcrumb.map((page, i) => {
    const path = `${breadcrumb
      .slice(0, i + 1)
      .map((page) => page.slug)
      .join('/')}/`;
    return {
      path,
      title: page.title,
    };
  });
};

export const getJsonLd = (path: string, customPageInfo?: PageInfo | null) => {
  const pageInfo = getPageInfo(path);
  const breadcrumb = getBreadcrumb(path, customPageInfo);
  const breadcrumbJson = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      ...(breadcrumb || []).map((item: any, i: any) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.title,
        item: SITE_URL + (item.path === '/' ? '' : item.path),
      })),
    ],
  };
  const homeJson = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };

  return JSON.stringify(pageInfo.isHome ? [homeJson, breadcrumbJson] : breadcrumbJson);
};

export const getPageTitle = (pageInfo: PageInfo, title?: string): string => {
  if (pageInfo.isHome) {
    return pageInfo.title;
  }

  const baseTitle = title || pageInfo.title;
  return `${baseTitle}｜${SITE_NAME}`;
};

export const getPageDescription = (pageInfo: PageInfo, description?: string): string => {
  return description || pageInfo.description;
};
