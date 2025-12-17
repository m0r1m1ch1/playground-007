/**
 * ユーザーエージェント情報を表す型
 */
type UserAgentInfo = {
  /** クローラー（検索エンジンのボットなど）かどうか */
  isCrawler: boolean;
};

/**
 * ユーザーエージェント情報を判定・取得する
 * @returns ユーザーエージェント情報
 */
export const getUserAgentInfo = (): UserAgentInfo => {
  if (typeof window === 'undefined') {
    return getDefaultUserAgentInfo();
  }

  const userAgent = navigator.userAgent;
  const isCrawler = isCrawlerUserAgent(userAgent);

  return {
    isCrawler,
  };
};

/**
 * ユーザーエージェントがクローラーかどうかを判定する
 * @param userAgent ユーザーエージェント文字列（省略時はnavigator.userAgentを使用）
 * @returns クローラーの場合true
 */
export const isCrawlerUserAgent = (userAgent?: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const ua = userAgent || navigator.userAgent;
  const crawlerPattern = /bot|googlebot|crawler|spider|robot|crawling/i;

  return crawlerPattern.test(ua);
};

const getDefaultUserAgentInfo = (): UserAgentInfo => ({
  isCrawler: false,
});
