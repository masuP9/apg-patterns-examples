<script lang="ts">
  import Feed, { type FeedArticle } from './Feed.svelte';
  import KeyboardHints from './KeyboardHints.svelte';

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

  const generateArticle = (index: number): FeedArticle => ({
    id: `article-${index}`,
    title: articleTitles[(index - 1) % articleTitles.length],
    description: articleDescriptions[(index - 1) % articleDescriptions.length],
    content: articleContents[(index - 1) % articleContents.length],
  });

  const demoArticles: FeedArticle[] = [generateArticle(1), generateArticle(2), generateArticle(3)];

  let scrollContainerRef: HTMLDivElement;
  let articles = $state<FeedArticle[]>([...demoArticles]);
  let loading = $state(false);
  let hasMore = $state(true);

  function loadMore() {
    if (loading || !hasMore) return;

    loading = true;

    setTimeout(() => {
      const nextIndex = articles.length + 1;
      articles = [...articles, generateArticle(nextIndex), generateArticle(nextIndex + 1)];
      loading = false;

      if (articles.length >= 10) {
        hasMore = false;
      }
    }, 1000);
  }

  function addArticle() {
    const nextIndex = articles.length + 1;
    articles = [...articles, generateArticle(nextIndex)];
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
    Add Article
  </button>

  <div
    bind:this={scrollContainerRef}
    class="apg-feed-scroll-container"
    style="max-height: 400px; overflow: auto"
  >
    <Feed
      {articles}
      aria-label="Blog articles with infinite scroll"
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
