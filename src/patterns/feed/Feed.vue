<template>
  <div
    ref="containerRef"
    role="feed"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-busy="loading"
    :class="['apg-feed', props.class].filter(Boolean)"
    @keydown="handleKeyDown"
  >
    <article
      v-for="(article, index) in articles"
      :key="article.id"
      :ref="(el) => setArticleRef(index, el)"
      class="apg-feed-article"
      :tabindex="index === focusedIndex ? 0 : -1"
      :aria-labelledby="`${baseId}-article-${article.id}-title`"
      :aria-describedby="article.description ? `${baseId}-article-${article.id}-desc` : undefined"
      :aria-posinset="index + 1"
      :aria-setsize="computedSetSize"
      @focus="handleArticleFocus(index)"
    >
      <h3 :id="`${baseId}-article-${article.id}-title`">
        {{ article.title }}
      </h3>
      <p v-if="article.description" :id="`${baseId}-article-${article.id}-desc`">
        {{ article.description }}
      </p>
      <div class="apg-feed-article-content">{{ article.content }}</div>
    </article>
    <!-- Sentinel element for infinite scroll detection -->
    <div
      v-if="!disableAutoLoad"
      ref="sentinelRef"
      aria-hidden="true"
      style="height: 1px; visibility: hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

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

/**
 * Feed component props
 */
export interface FeedProps {
  /** Array of article data */
  articles: FeedArticle[];
  /** Accessible name for the feed (mutually exclusive with ariaLabelledby) */
  ariaLabel?: string;
  /** ID reference to visible label (mutually exclusive with ariaLabel) */
  ariaLabelledby?: string;
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
  /** Disable automatic infinite scroll (manual load only) */
  disableAutoLoad?: boolean;
  /** Intersection Observer root margin for triggering load (default: "200px") */
  loadMoreRootMargin?: string;
}

const props = withDefaults(defineProps<FeedProps>(), {
  loading: false,
  disableAutoLoad: false,
  loadMoreRootMargin: '200px',
});

const emit = defineEmits<{
  /**
   * Emitted when focus changes between articles
   * @param articleId - ID of the focused article
   * @param index - Index of the focused article (0-based)
   */
  focusChange: [articleId: string, index: number];
  /**
   * Emitted when more content should be loaded (called automatically on scroll)
   */
  loadMore: [];
}>();

// Generate unique base ID
const baseId = ref('');
onMounted(() => {
  baseId.value = `feed-${Math.random().toString(36).slice(2, 9)}`;
});

// Refs
const containerRef = ref<HTMLDivElement | null>(null);
const articleRefs = ref<(HTMLElement | null)[]>([]);
const sentinelRef = ref<HTMLDivElement | null>(null);

// State
const focusedIndex = ref(0);

// Intersection Observer
let observer: IntersectionObserver | null = null;

const setupObserver = () => {
  if (props.disableAutoLoad || !sentinelRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !props.loading) {
        emit('loadMore');
      }
    },
    {
      rootMargin: props.loadMoreRootMargin,
      threshold: 0,
    }
  );

  observer.observe(sentinelRef.value);
};

const cleanupObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};

onMounted(() => {
  setupObserver();
});

onUnmounted(() => {
  cleanupObserver();
});

// Re-setup observer when relevant props change
watch(
  () => [props.disableAutoLoad, props.loadMoreRootMargin],
  () => {
    cleanupObserver();
    setupObserver();
  }
);

// Computed
const computedSetSize = computed(() =>
  props.setSize !== undefined ? props.setSize : props.articles.length
);

// Set article ref
const setArticleRef = (index: number, el: unknown) => {
  if (el instanceof HTMLElement) {
    articleRefs.value[index] = el;
  }
};

// Focus an article by index
const focusArticle = (index: number) => {
  const article = articleRefs.value[index];
  if (article) {
    article.focus();
    focusedIndex.value = index;
    if (props.articles[index]) {
      emit('focusChange', props.articles[index].id, index);
    }
  }
};

// Find focusable element outside the feed
const focusOutsideFeed = (direction: 'before' | 'after') => {
  const feedElement = containerRef.value;
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
};

// Handle keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  // Find which article (or element inside article) has focus
  const { target } = event;
  if (!(target instanceof HTMLElement)) return;

  let currentIndex = focusedIndex.value;

  // Check if focus is on an article or inside an article
  for (let i = 0; i < articleRefs.value.length; i++) {
    const article = articleRefs.value[i];
    if (article && (article === target || article.contains(target))) {
      currentIndex = i;
      break;
    }
  }

  switch (event.key) {
    case 'PageDown':
      event.preventDefault();
      if (currentIndex < props.articles.length - 1) {
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
};

// Handle focus on article
const handleArticleFocus = (index: number) => {
  focusedIndex.value = index;
  if (props.articles[index]) {
    emit('focusChange', props.articles[index].id, index);
  }
};
</script>

<style scoped>
/* Styles are in src/styles/patterns/feed.css */
</style>
