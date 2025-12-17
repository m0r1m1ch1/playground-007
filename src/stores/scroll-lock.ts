import { atom } from 'nanostores';

type ScrollState = {
  isLocked: boolean;
  scrollY: number;
};
const scroll = atom<ScrollState>({
  isLocked: false,
  scrollY: 0,
});
const isClient = typeof window !== 'undefined';

const updateScrollbarWidth = (width: number) => {
  if (!isClient) return;
  document.documentElement.style.setProperty('--scrollbar-width', `${width}px`);
};

export const scrollLockStore = {
  lock: () => {
    if (!isClient) return;
    if (scroll.get().isLocked) return;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.body.clientWidth;
    scroll.set({ isLocked: true, scrollY });
    document.body.style.top = `${scrollY * -1}px`;
    updateScrollbarWidth(scrollbarWidth);
    document.body.classList.add('-scroll-lock');
  },

  unlock: () => {
    if (!isClient) return;
    if (!scroll.get().isLocked) return;
    const { scrollY } = scroll.get();
    scroll.set({ isLocked: false, scrollY: 0 });
    document.body.style.top = '';
    updateScrollbarWidth(0);
    document.body.classList.remove('-scroll-lock');
    window.scrollTo(0, scrollY);
  },

  isLocked: () => scroll.get().isLocked,
  subscribe: scroll.subscribe.bind(scroll),
};
