<template>
  <div class="apg-feed-demo-wrapper">
    <KeyboardHintsJa />
    <button
      type="button"
      class="apg-feed-demo-button"
      data-testid="before-feed"
      @click="addArticle"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path
          d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2z"
        />
      </svg>
      パターンを追加
    </button>

    <div
      ref="scrollContainerRef"
      class="apg-feed-scroll-container"
      style="max-height: 400px; overflow: auto"
    >
      <Feed
        :articles="articles"
        aria-label="無限スクロール付き APG パターンフィード"
        :loading="loading"
        :set-size="hasMore ? -1 : articles.length"
        load-more-root-margin="100px"
        data-testid="feed-demo"
        @load-more="loadMore"
      />
      <div v-if="loading" class="apg-feed-loading-indicator" aria-live="polite">
        記事を読み込み中...
      </div>
      <div v-if="!hasMore" class="apg-feed-end-message">フィードの終わりです。</div>
    </div>

    <button
      type="button"
      class="apg-feed-demo-button"
      data-testid="after-feed"
      @click="scrollToTop"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path
          d="M8 3.5a.75.75 0 0 1 .53.22l4 4a.75.75 0 1 1-1.06 1.06L8 5.31 4.53 8.78a.75.75 0 0 1-1.06-1.06l4-4A.75.75 0 0 1 8 3.5z"
        />
        <path d="M8 7.5a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 8 7.5z" />
      </svg>
      トップに戻る
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Feed, { type FeedArticle } from './Feed.vue';
import KeyboardHintsJa from './KeyboardHintsJa.vue';
import { getPatterns, type Pattern } from '@/lib/patterns';

const patterns = getPatterns();

const generateArticleFromPattern = (pattern: Pattern): FeedArticle => ({
  id: `article-${pattern.id}`,
  title: `${pattern.icon} ${pattern.name}`,
  description: pattern.description,
  content: `${pattern.description}\n\n${pattern.name} パターンを見る: /ja/patterns/${pattern.id}/vue/`,
});

const initialArticles: FeedArticle[] = patterns
  .slice(0, 3)
  .map((pattern) => generateArticleFromPattern(pattern));

const scrollContainerRef = ref<HTMLDivElement | null>(null);
const articles = ref<FeedArticle[]>([...initialArticles]);
const loading = ref(false);
const hasMore = ref(true);

const loadMore = () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;

  setTimeout(() => {
    const currentLength = articles.value.length;
    const nextPatterns = patterns.slice(currentLength, currentLength + 2);
    const newArticles = nextPatterns.map((pattern) => generateArticleFromPattern(pattern));

    articles.value.push(...newArticles);
    loading.value = false;

    if (currentLength + newArticles.length >= patterns.length) {
      hasMore.value = false;
    }
  }, 1000);
};

const addArticle = () => {
  const currentLength = articles.value.length;
  if (currentLength < patterns.length) {
    const nextPattern = patterns[currentLength];
    articles.value.push(generateArticleFromPattern(nextPattern));
  }
};

const scrollToTop = () => {
  scrollContainerRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
/* Styles are in src/styles/patterns/feed.css */
</style>
