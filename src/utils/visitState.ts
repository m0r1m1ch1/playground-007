export type VisitState = {
  isNewSession: boolean;
  isReload: boolean;
  isInternal: boolean;
  isBackForward: boolean;
  isExternal: boolean;
};

// モジュールレベルの変数に値を保存
let visitStateValue: VisitState | null = null;

/**
 * Layout.astroで1回だけ呼び出す関数
 * 計算してsessionStorageに書き込み、値を保存
 */
export const getVisitState = (): VisitState => {
  if (visitStateValue) {
    return visitStateValue; // 既に計算済みの場合はそれを返す
  }

  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  const referrer = document.referrer;
  const isInternal = referrer.startsWith(location.origin + '/');
  const perfEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const type = perfEntry?.type || null;

  const isNewSession = sessionStorage.getItem('visited') === null;
  if (isNewSession) {
    sessionStorage.setItem('visited', 'true');
  }

  visitStateValue = {
    isNewSession,
    isReload: type === 'reload',
    isInternal,
    isBackForward: type === 'back_forward',
    isExternal: !isInternal && referrer !== '',
  };

  return visitStateValue;
};

/**
 * 他のコンポーネントで使用するオブジェクト
 * 保存された値を取得するだけ（再計算しない）
 */
export const visitState = {
  isNewSession: (): boolean => getVisitState().isNewSession,
  isReload: (): boolean => getVisitState().isReload,
  isInternal: (): boolean => getVisitState().isInternal,
  isBackForward: (): boolean => getVisitState().isBackForward,
  isExternal: (): boolean => getVisitState().isExternal,
};

/**
 * キャッシュをリセット（SPA遷移時に使用）
 */
export const resetVisitStateCache = (): void => {
  visitStateValue = null;
};

export const isFirstPageVisit = (pageKey: string): boolean => {
  if (typeof window === 'undefined') return true;

  const pageVisitKey = `page-visited-${pageKey}`;
  const hasVisited = sessionStorage.getItem(pageVisitKey) !== null;
  const currentPageKey = getCurrentPageKey();

  if (currentPageKey !== null && currentPageKey === pageKey && !hasVisited) {
    sessionStorage.setItem(pageVisitKey, 'true');
  }

  return !hasVisited;
};

export const getCurrentPageKey = (): string | null => {
  if (typeof window === 'undefined') return null;

  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') return 'home';

  const match = path.match(/\/([^\/\.]+)(?:\/|\.html)?$/);
  return match ? match[1] : null;
};

const getDefaultState = (): VisitState => ({
  isNewSession: true,
  isReload: false,
  isInternal: false,
  isBackForward: false,
  isExternal: false,
});
