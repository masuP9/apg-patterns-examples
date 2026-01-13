import { useCallback, useEffect, useId, useRef, useState } from 'react';

/**
 * Feed Article data structure
 */
export interface FeedArticle {
  /** Unique identifier for the article */
  id: string;
  /** Article title (required for aria-labelledby) */
  title: string;
  /** Optional description (used for aria-describedby) */
  description?: string;
  /** Article content (React elements are safe from XSS) */
  content: React.ReactNode;
}

/**
 * Feed component props
 */
export interface FeedProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  /** Array of article data */
  articles: FeedArticle[];
  /** Accessible name for the feed (mutually exclusive with aria-labelledby) */
  'aria-label'?: string;
  /** ID reference to visible label (mutually exclusive with aria-label) */
  'aria-labelledby'?: string;
  /**
   * Total number of articles
   * - undefined: use articles.length (auto-calculate)
   * - -1: unknown total (infinite scroll)
   * - positive number: explicit total count
   */
  setSize?: number;
  /** Loading state (suppresses onLoadMore during loading) */
  loading?: boolean;
  /** Callback when more content should be loaded (called automatically on scroll) */
  onLoadMore?: () => void;
  /**
   * Callback when focus changes between articles
   * @param articleId - ID of the focused article
   * @param index - Index of the focused article (0-based)
   */
  onFocusChange?: (articleId: string, index: number) => void;
  /** Disable automatic infinite scroll (manual load only) */
  disableAutoLoad?: boolean;
  /** Intersection Observer root margin for triggering load (default: "200px") */
  loadMoreRootMargin?: string;
}

/**
 * Feed Pattern Component
 *
 * A feed is a section of a page that automatically loads new sections of content
 * as the user scrolls. It is a structure (not a widget), allowing assistive
 * technologies to use their default reading mode.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/feed/
 *
 * Features:
 * - Page Up/Down navigation between articles (not Arrow keys)
 * - Ctrl+Home/End to escape the feed
 * - Roving tabindex on articles
 * - aria-busy during dynamic loading
 * - aria-posinset/aria-setsize on each article
 */
export function Feed({
  articles,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  setSize,
  loading = false,
  onLoadMore,
  onFocusChange,
  disableAutoLoad = false,
  loadMoreRootMargin = '200px',
  className,
  ...rest
}: FeedProps) {
  const baseId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Warn if no accessible name is provided
  useEffect(() => {
    if (!ariaLabel && !ariaLabelledby) {
      console.warn(
        'Feed: An accessible name is required. ' +
        'Provide either aria-label or aria-labelledby prop.'
      );
    }
  }, [ariaLabel, ariaLabelledby]);

  // Calculate aria-setsize
  const computedSetSize = setSize !== undefined ? setSize : articles.length;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (disableAutoLoad || !onLoadMore || !sentinelRef.current) return;

    const sentinel = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          onLoadMore();
        }
      },
      {
        rootMargin: loadMoreRootMargin,
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [disableAutoLoad, loading, onLoadMore, loadMoreRootMargin]);

  // Focus an article by index
  const focusArticle = useCallback(
    (index: number) => {
      const article = articleRefs.current[index];
      if (article) {
        article.focus();
        setFocusedIndex(index);
        if (onFocusChange && articles[index]) {
          onFocusChange(articles[index].id, index);
        }
      }
    },
    [articles, onFocusChange]
  );

  // Find focusable element outside the feed
  const focusOutsideFeed = useCallback((direction: 'before' | 'after') => {
    const feedElement = containerRef.current;
    if (!feedElement) return;

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])';

    // Get all focusable elements in document order
    const allFocusable = Array.from(document.querySelectorAll<HTMLElement>(focusableSelector));

    // Find the index range of feed elements
    let feedStartIndex = -1;
    let feedEndIndex = -1;

    for (let i = 0; i < allFocusable.length; i++) {
      if (feedElement.contains(allFocusable[i]) || allFocusable[i] === feedElement) {
        if (feedStartIndex === -1) feedStartIndex = i;
        feedEndIndex = i;
      }
    }

    if (direction === 'before') {
      // Find the last focusable element before the feed
      if (feedStartIndex > 0) {
        allFocusable[feedStartIndex - 1].focus();
      }
    } else {
      // Find the first focusable element after the feed
      if (feedEndIndex >= 0 && feedEndIndex < allFocusable.length - 1) {
        allFocusable[feedEndIndex + 1].focus();
      }
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Find which article (or element inside article) has focus
      const { target } = event;
      if (!(target instanceof HTMLElement)) return;

      let currentIndex = focusedIndex;

      // Check if focus is on an article or inside an article
      for (let i = 0; i < articleRefs.current.length; i++) {
        const article = articleRefs.current[i];
        if (article && (article === target || article.contains(target))) {
          currentIndex = i;
          break;
        }
      }

      switch (event.key) {
        case 'PageDown':
          event.preventDefault();
          if (currentIndex < articles.length - 1) {
            focusArticle(currentIndex + 1);
          }
          break;

        case 'PageUp':
          event.preventDefault();
          if (currentIndex > 0) {
            focusArticle(currentIndex - 1);
          }
          break;

        case 'End':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            focusOutsideFeed('after');
          }
          break;

        case 'Home':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            focusOutsideFeed('before');
          }
          break;
      }
    },
    [articles.length, focusArticle, focusOutsideFeed, focusedIndex]
  );

  // Handle focus on article
  const handleArticleFocus = useCallback(
    (index: number) => {
      setFocusedIndex(index);
      if (onFocusChange && articles[index]) {
        onFocusChange(articles[index].id, index);
      }
    },
    [articles, onFocusChange]
  );

  return (
    // disabled to allow div with role="feed" to have keyboard events for capture children elements events
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={containerRef}
      role="feed"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-busy={loading}
      className={['apg-feed', className].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {articles.map(({ id, title, description, content }, index) => {
        const titleId = `${baseId}-article-${id}-title`;
        const descId = description ? `${baseId}-article-${id}-desc` : undefined;

        return (
          <article
            key={id}
            ref={(el) => {
              articleRefs.current[index] = el;
            }}
            className="apg-feed-article"
            tabIndex={index === focusedIndex ? 0 : -1}
            aria-labelledby={titleId}
            aria-describedby={descId}
            aria-posinset={index + 1}
            aria-setsize={computedSetSize}
            onFocus={() => handleArticleFocus(index)}
          >
            <h3 id={titleId}>
              {title}
            </h3>
            {description && <p id={descId}>{description}</p>}
            <div className="apg-feed-article-content">{content}</div>
          </article>
        );
      })}
      {/* Sentinel element for infinite scroll detection */}
      {onLoadMore && !disableAutoLoad && (
        <div ref={sentinelRef} aria-hidden="true" style={{ height: '1px', visibility: 'hidden' }} />
      )}
    </div>
  );
}

export default Feed;
