<script lang="ts">
  import { onMount } from 'svelte';

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
    /** Article content (plain text) */
    content: string;
  }

  interface FeedProps {
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
    /** Additional CSS class */
    class?: string;
    /**
     * Callback when focus changes between articles
     */
    onfocuschange?: (detail: { articleId: string; index: number }) => void;
    /** Callback when more content should be loaded (called automatically on scroll) */
    onloadmore?: () => void;
    /** Disable automatic infinite scroll (manual load only) */
    disableAutoLoad?: boolean;
    /** Intersection Observer root margin for triggering load (default: "200px") */
    loadMoreRootMargin?: string;
  }

  let {
    articles = [],
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    setSize,
    loading = false,
    class: className = '',
    onfocuschange = () => {},
    onloadmore,
    disableAutoLoad = false,
    loadMoreRootMargin = '200px',
    ...restProps
  }: FeedProps = $props();

  // State
  let focusedIndex = $state(0);
  let baseId = $state('');

  // Refs
  let containerRef: HTMLDivElement;
  let articleRefs: (HTMLElement | null)[] = [];
  let sentinelRef: HTMLDivElement;

  // Computed
  let computedSetSize = $derived(setSize !== undefined ? setSize : articles.length);

  // Generate ID on mount
  onMount(() => {
    baseId = `feed-${Math.random().toString(36).slice(2, 9)}`;
  });

  // Intersection Observer for infinite scroll
  $effect(() => {
    if (disableAutoLoad || !onloadmore || !sentinelRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          onloadmore();
        }
      },
      {
        rootMargin: loadMoreRootMargin,
        threshold: 0,
      }
    );

    observer.observe(sentinelRef);

    return () => {
      observer.disconnect();
    };
  });

  // Focus an article by index
  function focusArticle(index: number) {
    const article = articleRefs[index];
    if (article) {
      article.focus();
      focusedIndex = index;
      if (articles[index]) {
        onfocuschange({ articleId: articles[index].id, index });
      }
    }
  }

  // Find focusable element outside the feed
  function focusOutsideFeed(direction: 'before' | 'after') {
    const feedElement = containerRef;
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
  }

  // Handle keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    // Find which article (or element inside article) has focus
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;

    let currentIndex = focusedIndex;

    // Check if focus is on an article or inside an article
    for (let i = 0; i < articleRefs.length; i++) {
      const article = articleRefs[i];
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
  }

  // Handle focus on article
  function handleArticleFocus(index: number) {
    focusedIndex = index;
    if (articles[index]) {
      onfocuschange({ articleId: articles[index].id, index });
    }
  }
</script>

<div
  bind:this={containerRef}
  role="feed"
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  aria-busy={loading}
  class={['apg-feed', className].filter(Boolean).join(' ') || undefined}
  onkeydown={handleKeyDown}
  {...restProps}
>
  {#each articles as article, index (article.id)}
    <article
      bind:this={articleRefs[index]}
      class="apg-feed-article"
      tabindex={index === focusedIndex ? 0 : -1}
      aria-labelledby={`${baseId}-article-${article.id}-title`}
      aria-describedby={article.description ? `${baseId}-article-${article.id}-desc` : undefined}
      aria-posinset={index + 1}
      aria-setsize={computedSetSize}
      onfocus={() => handleArticleFocus(index)}
    >
      <h3 id={`${baseId}-article-${article.id}-title`}>
        {article.title}
      </h3>
      {#if article.description}
        <p id={`${baseId}-article-${article.id}-desc`}>{article.description}</p>
      {/if}
      <div class="apg-feed-article-content">{article.content}</div>
    </article>
  {/each}
  <!-- Sentinel element for infinite scroll detection -->
  {#if onloadmore && !disableAutoLoad}
    <div bind:this={sentinelRef} aria-hidden="true" style="height: 1px; visibility: hidden"></div>
  {/if}
</div>

<style>
  /* Styles are in src/styles/patterns/feed.css */
</style>
