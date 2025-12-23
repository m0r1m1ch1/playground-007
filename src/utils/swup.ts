import { Overlay } from '@/components/layout/overlay/Overlay';

export const swup = {
  onHook(hook: string, fn: SwupHookHandler, options: SwupHookOptions = {}) {
    const handleSwupEnable = () => {
      window?.swup?.hooks.on(hook, fn, options);
    };
    swup.enable(handleSwupEnable);
  },

  offHook(hook: string, fn: SwupHookHandler) {
    const handleSwupEnable = () => {
      window?.swup?.hooks.off(hook, fn);
    };
    swup.enable(handleSwupEnable);
  },

  enable(fn: SwupEnableHandler) {
    if (window?.swup) {
      fn();
    } else {
      document.addEventListener('swup:enable', fn, { once: true });
    }
  },
};

export const initPageTransitionHooks = () => {
  const html = document.documentElement;
  const body = document.body;
  const overlay = new Overlay();

  swup.onHook('visit:start', async (visit) => {
    console.group('visit:start: Swup ページ遷移');
    overlay.startAnimateBars();
    console.log('遷移元:', visit.from.url);
    console.log('遷移先:', visit.to.url);
    console.log('トリガー:', visit.trigger);
    console.time('遷移時間');
  });

  swup.onHook('animation:out:start', () => {
    console.log('animation:out:start: 📤 現在のページから離脱中...');
  });

  swup.onHook('content:replace', () => {
    console.log('content:replace: 🔄 コンテンツ置換完了');
    // overlay.animationEnd();
    console.log('🎉 オーバーレイアニメーション');
    overlay.endAnimateBars();
  });

  swup.onHook('animation:in:end', () => {
    console.log('animation:in:end: 📥 新しいページのアニメーション完了');
  });

  swup.onHook('page:view', () => {
    console.log('page:view: 👁️ ページ表示準備完了');
    reInitComponents();
  });

  swup.onHook('visit:end', () => {
    console.timeEnd('visit:end: 遷移時間');
    console.groupEnd();
  });

  // エラーハンドリング
  swup.onHook('fetch:error', (error: any): any => {
    console.error('❌ ページ取得エラー:', error);
  });
};

const reInitComponents = () => {};

export const setUpSwupScrollPlugin = () => {
  const pluginInstance = window.swup?.findPlugin('SwupScrollPlugin');
  if (!pluginInstance) return;

  pluginInstance.options.offset = () => {
    const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
    return parseFloat(headerHeight) || 0;
  };
};

export const setUpSwupA11yPlugin = () => {
  const pluginInstance = window.swup?.findPlugin('SwupA11yPlugin');
  if (!pluginInstance) return;

  pluginInstance.options.announcements = {
    visit: '{title} に移動しました',
    url: '新しいURLは {url} です',
  };
};
