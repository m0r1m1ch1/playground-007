import type { MediaQueryType } from '@/types/';
import { atom, onMount } from 'nanostores';
import type { WritableAtom } from 'nanostores';

const createMediaQuery = (query: string): WritableAtom<boolean | undefined> => {
  const mediaAtom = atom<boolean | undefined>(undefined);

  onMount(mediaAtom, () => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    const updateMedia = () => mediaAtom.set(mediaQuery.matches);
    updateMedia();

    mediaQuery.addEventListener('change', updateMedia);
    return () => mediaQuery.removeEventListener('change', updateMedia);
  });

  return mediaAtom;
};

const mediaQueries = {
  mobile: '(width < max(768px, 48rem))',
  tablet: '(width >= max(768px, 48rem)) and (width < max(1024px, 64rem))',
  desktop: '(width >= max(1024px, 64rem))',
};

export const mediaQuery = {
  mobile: createMediaQuery(mediaQueries.mobile),
  tablet: createMediaQuery(mediaQueries.tablet),
  desktop: createMediaQuery(mediaQueries.desktop),
};

export const mediaQueryStore = {
  get: (): MediaQueryType | undefined => {
    if (mediaQuery.mobile.get()) return 'mobile';
    if (mediaQuery.tablet.get()) return 'tablet';
    if (mediaQuery.desktop.get()) return 'desktop';
    return undefined;
  },
  isMobile: () => mediaQuery.mobile.get() ?? false,
  isTablet: () => mediaQuery.tablet.get() ?? false,
  isDesktop: () => mediaQuery.desktop.get() ?? false,
  subscribeMobile: mediaQuery.mobile.subscribe,
  subscribeTablet: mediaQuery.tablet.subscribe,
  subscribeDesktop: mediaQuery.desktop.subscribe,
};
