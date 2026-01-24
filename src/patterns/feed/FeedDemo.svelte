<script lang="ts">
  import Feed, { type FeedArticle } from './Feed.svelte';
  import KeyboardHints from './KeyboardHints.svelte';
  import { getPatterns, type Pattern } from '@/lib/patterns';

  const patterns = getPatterns();

  const generateArticleFromPattern = (pattern: Pattern): FeedArticle => ({
    id: `article-${pattern.id}`,
    title: `${pattern.icon} ${pattern.name}`,
    description: pattern.description,
    content: `${pattern.description}\n\nView ${pattern.name} pattern: /patterns/${pattern.id}/svelte/`,
  });

  const initialArticles: FeedArticle[] = patterns
    .slice(0, 3)
    .map((pattern) => generateArticleFromPattern(pattern));

  let scrollContainerRef: HTMLDivElement;
  let articles = $state<FeedArticle[]>([...initialArticles]);
  let loading = $state(false);
  let hasMore = $state(true);

  function loadMore() {
    if (loading || !hasMore) return;

    loading = true;

    setTimeout(() => {
      const currentLength = articles.length;
      const nextPatterns = patterns.slice(currentLength, currentLength + 2);
      const newArticles = nextPatterns.map((pattern) => generateArticleFromPattern(pattern));

      articles = [...articles, ...newArticles];
      loading = false;

      if (currentLength + newArticles.length >= patterns.length) {
        hasMore = false;
      }
    }, 1000);
  }

  function addArticle() {
    const currentLength = articles.length;
    if (currentLength < patterns.length) {
      const nextPattern = patterns[currentLength];
      articles = [...articles, generateArticleFromPattern(nextPattern)];
    }
  }

  function scrollToTop() {
    scrollContainerRef?.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<div class="apg-feed-demo-wrapper">
  <KeyboardHints />
  <button type="button" class="apg-feed-demo-button" data-testid="before-feed" onclick={addArticle}>
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path
        d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2z"
      />
    </svg>
    Add Pattern
  </button>

  <div
    bind:this={scrollContainerRef}
    class="apg-feed-scroll-container"
    style="max-height: 400px; overflow: auto"
  >
    <Feed
      {articles}
      aria-label="APG Patterns feed with infinite scroll"
      {loading}
      setSize={hasMore ? -1 : articles.length}
      loadMoreRootMargin="100px"
      data-testid="feed-demo"
      onloadmore={loadMore}
    />
    {#if loading}
      <div class="apg-feed-loading-indicator" aria-live="polite">Loading more articles...</div>
    {/if}
    {#if !hasMore}
      <div class="apg-feed-end-message">You've reached the end of the feed.</div>
    {/if}
  </div>

  <button type="button" class="apg-feed-demo-button" data-testid="after-feed" onclick={scrollToTop}>
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path
        d="M8 3.5a.75.75 0 0 1 .53.22l4 4a.75.75 0 1 1-1.06 1.06L8 5.31 4.53 8.78a.75.75 0 0 1-1.06-1.06l4-4A.75.75 0 0 1 8 3.5z"
      />
      <path d="M8 7.5a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 8 7.5z" />
    </svg>
    Back to top
  </button>
</div>

<style>
  /* Styles are in src/styles/patterns/feed.css */
</style>
