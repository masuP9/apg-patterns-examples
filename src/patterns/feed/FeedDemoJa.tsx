import { useState, useCallback, useRef } from 'react';
import { Feed, type FeedArticle } from './Feed';
import { getAvailablePatterns, type Pattern } from '@/lib/patterns';

const availablePatterns = getAvailablePatterns();

const generateArticleFromPattern = (pattern: Pattern): FeedArticle => ({
  id: `article-${pattern.id}`,
  title: `${pattern.icon} ${pattern.name}`,
  description: `複雑度: ${pattern.complexity}`,
  content: (
    <>
      <p>{pattern.description}</p>
      <p>
        <a href={`/ja/patterns/${pattern.id}/react/`}>{pattern.name} パターンを見る →</a>
      </p>
    </>
  ),
});

const initialArticles: FeedArticle[] = availablePatterns
  .slice(0, 3)
  .map((pattern) => generateArticleFromPattern(pattern));

function KeyboardHints() {
  return (
    <div className="apg-feed-keyboard-hints">
      <div className="apg-feed-keyboard-hints-title">キーボード操作</div>
      <dl className="apg-feed-keyboard-hints-list">
        <div className="apg-feed-keyboard-hint">
          <dt>
            <kbd>Page Down</kbd> / <kbd>Page Up</kbd>
          </dt>
          <dd>記事間を移動</dd>
        </div>
        <div className="apg-feed-keyboard-hint">
          <dt>
            <kbd>Ctrl</kbd> + <kbd>End</kbd>
          </dt>
          <dd>フィードの後にフォーカス移動</dd>
        </div>
        <div className="apg-feed-keyboard-hint">
          <dt>
            <kbd>Ctrl</kbd> + <kbd>Home</kbd>
          </dt>
          <dd>フィードの前にフォーカス移動</dd>
        </div>
      </dl>
    </div>
  );
}

export function FeedDemoJa() {
  const [articles, setArticles] = useState<FeedArticle[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const currentLength = articles.length;
      const nextPatterns = availablePatterns.slice(currentLength, currentLength + 2);
      const newArticles = nextPatterns.map((pattern) => generateArticleFromPattern(pattern));

      setArticles((prev) => [...prev, ...newArticles]);
      setLoading(false);

      // Stop when all patterns are loaded
      if (currentLength + newArticles.length >= availablePatterns.length) {
        setHasMore(false);
      }
    }, 1000);
  }, [articles.length, loading, hasMore]);

  const addArticle = useCallback(() => {
    const currentLength = articles.length;
    if (currentLength < availablePatterns.length) {
      const nextPattern = availablePatterns[currentLength];
      setArticles((prev) => [...prev, generateArticleFromPattern(nextPattern)]);
    }
  }, [articles.length]);

  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="apg-feed-demo-wrapper">
      <KeyboardHints />
      <button
        type="button"
        className="apg-feed-demo-button"
        onClick={addArticle}
        data-testid="before-feed"
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2z" />
        </svg>
        パターンを追加
      </button>
      <div
        ref={scrollContainerRef}
        className="apg-feed-scroll-container"
        style={{ maxHeight: '400px', overflow: 'auto' }}
      >
        <Feed
          articles={articles}
          aria-label="無限スクロール付き APG パターンフィード"
          loading={loading}
          setSize={hasMore ? -1 : articles.length}
          onLoadMore={loadMore}
          loadMoreRootMargin="100px"
          data-testid="feed-demo"
        />
        {loading && (
          <div className="apg-feed-loading-indicator" aria-live="polite">
            記事を読み込み中...
          </div>
        )}
        {!hasMore && <div className="apg-feed-end-message">フィードの終わりです。</div>}
      </div>
      <button
        type="button"
        className="apg-feed-demo-button"
        onClick={scrollToTop}
        data-testid="after-feed"
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3.5a.75.75 0 0 1 .53.22l4 4a.75.75 0 1 1-1.06 1.06L8 5.31 4.53 8.78a.75.75 0 0 1-1.06-1.06l4-4A.75.75 0 0 1 8 3.5z" />
          <path d="M8 7.5a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 8 7.5z" />
        </svg>
        トップに戻る
      </button>
    </div>
  );
}

export default FeedDemoJa;
