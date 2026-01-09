import { useState, useCallback, useRef } from 'react';
import { Feed, type FeedArticle } from './Feed';

const generateArticle = (index: number): FeedArticle => ({
  id: `article-${index}`,
  title: articleTitles[index % articleTitles.length],
  description: articleDescriptions[index % articleDescriptions.length],
  content: articleContents[index % articleContents.length],
});

const articleTitles = [
  'Getting Started with Accessible Components',
  'Understanding the Feed Pattern',
  'Keyboard Navigation Best Practices',
  'ARIA Attributes Deep Dive',
  'Building Inclusive Web Experiences',
];

const articleDescriptions = [
  'Learn the fundamentals of building accessible web components.',
  'Deep dive into the APG Feed pattern implementation.',
  'Tips for implementing effective keyboard navigation.',
  'Understanding ARIA roles, states, and properties.',
  'Creating web experiences that work for everyone.',
];

const articleContents = [
  'Building accessible web components is essential for creating inclusive web experiences. This guide covers the basics of ARIA attributes, keyboard navigation, and focus management.',
  'The Feed pattern is designed for content that loads dynamically as users scroll. Unlike other patterns, Feed is a structure that allows screen readers to use their default reading mode.',
  'Effective keyboard navigation is crucial for accessibility. This article explores Page Up/Down navigation in feeds and how it differs from other patterns that use arrow keys.',
  'ARIA (Accessible Rich Internet Applications) provides attributes that define ways to make web content and applications more accessible.',
  'Inclusive design ensures that everyone, regardless of ability, can access and use your web application effectively.',
];

const initialArticles: FeedArticle[] = [generateArticle(1), generateArticle(2), generateArticle(3)];

function KeyboardHints() {
  return (
    <div className="apg-feed-keyboard-hints">
      <div className="apg-feed-keyboard-hints-title">Keyboard Navigation</div>
      <dl className="apg-feed-keyboard-hints-list">
        <div className="apg-feed-keyboard-hint">
          <dt>
            <kbd>Page Down</kbd> / <kbd>Page Up</kbd>
          </dt>
          <dd>Move between articles</dd>
        </div>
        <div className="apg-feed-keyboard-hint">
          <dt>
            <kbd>Ctrl</kbd> + <kbd>End</kbd>
          </dt>
          <dd>Move focus after feed</dd>
        </div>
        <div className="apg-feed-keyboard-hint">
          <dt>
            <kbd>Ctrl</kbd> + <kbd>Home</kbd>
          </dt>
          <dd>Move focus before feed</dd>
        </div>
      </dl>
    </div>
  );
}

export function FeedDemo() {
  const [articles, setArticles] = useState<FeedArticle[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const nextIndex = articles.length + 1;
      const newArticles = [generateArticle(nextIndex), generateArticle(nextIndex + 1)];

      setArticles((prev) => [...prev, ...newArticles]);
      setLoading(false);

      // Stop after 10 articles for demo
      if (articles.length >= 8) {
        setHasMore(false);
      }
    }, 1000);
  }, [articles.length, loading, hasMore]);

  const addArticle = useCallback(() => {
    const nextIndex = articles.length + 1;
    setArticles((prev) => [...prev, generateArticle(nextIndex)]);
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
        Add Article
      </button>
      <div
        ref={scrollContainerRef}
        className="apg-feed-scroll-container"
        style={{ maxHeight: '400px', overflow: 'auto' }}
      >
        <Feed
          articles={articles}
          aria-label="Blog articles with infinite scroll"
          loading={loading}
          setSize={hasMore ? -1 : articles.length}
          onLoadMore={loadMore}
          loadMoreRootMargin="100px"
          data-testid="feed-demo"
        />
        {loading && (
          <div className="apg-feed-loading-indicator" aria-live="polite">
            Loading more articles...
          </div>
        )}
        {!hasMore && (
          <div className="apg-feed-end-message">You've reached the end of the feed.</div>
        )}
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
        Back to top
      </button>
    </div>
  );
}

export default FeedDemo;
