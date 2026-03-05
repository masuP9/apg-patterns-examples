import type { PatternMeta } from '@/lib/pattern-meta-types';

const feedMeta: PatternMeta = {
  title: {
    en: 'Feed',
    ja: 'Feed',
  },
  description: {
    en: 'A scrollable list of articles where new content may be added as the user scrolls, enabling keyboard navigation between articles using Page Up/Down.',
    ja: 'スクロールに応じて新しいコンテンツが追加される記事リストで、Page Up/Down キーで記事間をナビゲートできます。',
  },
  tocItems: {
    en: [
      { id: 'demo', text: 'Demo' },
      { id: 'accessibility-features', text: 'Accessibility Features' },
      { id: 'source-code', text: 'Source Code' },
      { id: 'usage', text: 'Usage' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'Testing' },
      { id: 'resources', text: 'Resources' },
    ],
    ja: [
      { id: 'demo', text: 'デモ' },
      { id: 'accessibility-features', text: 'アクセシビリティ機能' },
      { id: 'source-code', text: 'ソースコード' },
      { id: 'usage', text: '使い方' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'テスト' },
      { id: 'resources', text: 'リソース' },
    ],
  },
  resources: [
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
      label: {
        en: 'WAI-ARIA APG: Feed Pattern',
        ja: 'WAI-ARIA APG: Feed パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Feed.tsx',
      testFile: 'Feed.test.tsx',
      lang: 'tsx',
      usageCode: `import { Feed } from './Feed';

const articles = [
  {
    id: 'article-1',
    title: 'Getting Started with React',
    description: 'Learn the basics of React development',
    content: <p>Full article content here...</p>
  },
  {
    id: 'article-2',
    title: 'Advanced Patterns',
    description: 'Explore advanced React patterns',
    content: <p>Full article content here...</p>
  }
];

function App() {
  return (
    <Feed
      articles={articles}
      aria-label="Blog posts"
      setSize={-1}
      loading={false}
      onLoadMore={() => console.log('Load more articles')}
      onFocusChange={(id, index) => console.log('Focused:', id, index)}
    />
  );
}`,
      apiProps: [
        {
          name: 'articles',
          type: 'FeedArticle[]',
          default: 'required',
          description: {
            en: 'Array of article items',
            ja: '記事アイテムの配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: 'conditional',
          description: {
            en: 'Accessible name (required if no aria-labelledby)',
            ja: 'アクセシブルな名前（aria-labelledby がない場合必須）',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: 'conditional',
          description: {
            en: 'ID reference to visible heading',
            ja: '可視見出しへの ID 参照',
          },
        },
        {
          name: 'setSize',
          type: 'number',
          default: 'articles.length',
          description: {
            en: 'Total count or -1 if unknown',
            ja: '総数、または不明な場合は -1',
          },
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Loading state (sets aria-busy)',
            ja: '読み込み状態（aria-busy を設定）',
          },
        },
        {
          name: 'onLoadMore',
          type: '() => void',
          default: '-',
          description: {
            en: 'Callback to load more articles',
            ja: '追加読み込みのコールバック',
          },
        },
        {
          name: 'onFocusChange',
          type: '(articleId: string, index: number) => void',
          default: '-',
          description: {
            en: 'Callback when focus changes',
            ja: 'フォーカス変更時のコールバック',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Feed.vue',
      testFile: 'Feed.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import Feed from './Feed.vue';

const articles = [
  {
    id: 'article-1',
    title: 'Getting Started with Vue',
    description: 'Learn the basics of Vue development',
    content: 'Full article content here...'
  },
  {
    id: 'article-2',
    title: 'Advanced Patterns',
    description: 'Explore advanced Vue patterns',
    content: 'Full article content here...'
  }
];

function handleLoadMore() {
  console.log('Load more articles');
}

function handleFocusChange(id: string, index: number) {
  console.log('Focused:', id, index);
}
</script>

<template>
  <Feed
    :articles="articles"
    aria-label="Blog posts"
    :set-size="-1"
    :loading="false"
    @load-more="handleLoadMore"
    @focus-change="handleFocusChange"
  />
</template>`,
      apiProps: [
        {
          name: 'articles',
          type: 'FeedArticle[]',
          default: 'required',
          description: {
            en: 'Array of article items',
            ja: '記事アイテムの配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: 'conditional',
          description: {
            en: 'Accessible name (required if no aria-labelledby)',
            ja: 'アクセシブルな名前（aria-labelledby がない場合必須）',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: 'conditional',
          description: {
            en: 'ID reference to visible heading',
            ja: '可視見出しへの ID 参照',
          },
        },
        {
          name: 'setSize',
          type: 'number',
          default: 'articles.length',
          description: {
            en: 'Total count or -1 if unknown',
            ja: '総数、または不明な場合は -1',
          },
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Loading state (sets aria-busy)',
            ja: '読み込み状態（aria-busy を設定）',
          },
        },
      ],
      apiEvents: [
        {
          name: 'load-more',
          detail: '-',
          description: {
            en: 'Emitted to load more articles',
            ja: '追加読み込み時に発火',
          },
        },
        {
          name: 'focus-change',
          detail: '[articleId: string, index: number]',
          description: {
            en: 'Emitted when focus changes',
            ja: 'フォーカス変更時に発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Feed.svelte',
      testFile: 'Feed.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import Feed from './Feed.svelte';

  const articles = [
    {
      id: 'article-1',
      title: 'Getting Started with Svelte',
      description: 'Learn the basics of Svelte development',
      content: 'Full article content here...'
    },
    {
      id: 'article-2',
      title: 'Advanced Patterns',
      description: 'Explore advanced Svelte patterns',
      content: 'Full article content here...'
    }
  ];

  function handleLoadMore() {
    console.log('Load more articles');
  }

  function handleFocusChange(id: string, index: number) {
    console.log('Focused:', id, index);
  }
</script>

<Feed
  {articles}
  aria-label="Blog posts"
  setSize={-1}
  loading={false}
  onloadmore={handleLoadMore}
  onfocuschange={handleFocusChange}
/>`,
      apiProps: [
        {
          name: 'articles',
          type: 'FeedArticle[]',
          default: 'required',
          description: {
            en: 'Array of article items',
            ja: '記事アイテムの配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: 'conditional',
          description: {
            en: 'Accessible name (required if no aria-labelledby)',
            ja: 'アクセシブルな名前（aria-labelledby がない場合必須）',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: 'conditional',
          description: {
            en: 'ID reference to visible heading',
            ja: '可視見出しへの ID 参照',
          },
        },
        {
          name: 'setSize',
          type: 'number',
          default: 'articles.length',
          description: {
            en: 'Total count or -1 if unknown',
            ja: '総数、または不明な場合は -1',
          },
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Loading state (sets aria-busy)',
            ja: '読み込み状態（aria-busy を設定）',
          },
        },
        {
          name: 'onloadmore',
          type: '() => void',
          default: '-',
          description: {
            en: 'Callback to load more articles',
            ja: '追加読み込みのコールバック',
          },
        },
        {
          name: 'onfocuschange',
          type: '(articleId: string, index: number) => void',
          default: '-',
          description: {
            en: 'Callback when focus changes',
            ja: 'フォーカス変更時のコールバック',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Feed.astro',
      testFile: 'Feed.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Feed from './Feed.astro';

const articles = [
  {
    id: 'article-1',
    title: 'Getting Started with Astro',
    description: 'Learn the basics of Astro development',
    content: '<p>Full article content here...</p>'
  },
  {
    id: 'article-2',
    title: 'Advanced Patterns',
    description: 'Explore advanced Astro patterns',
    content: '<p>Full article content here...</p>'
  }
];
---

<Feed
  articles={articles}
  aria-label="Blog posts"
  setSize={-1}
  loading={false}
/>`,
      apiProps: [
        {
          name: 'articles',
          type: 'FeedArticle[]',
          default: 'required',
          description: {
            en: 'Array of article items',
            ja: '記事アイテムの配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: 'conditional',
          description: {
            en: 'Accessible name (required if no aria-labelledby)',
            ja: 'アクセシブルな名前（aria-labelledby がない場合必須）',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: 'conditional',
          description: {
            en: 'ID reference to visible heading',
            ja: '可視見出しへの ID 参照',
          },
        },
        {
          name: 'setSize',
          type: 'number',
          default: 'articles.length',
          description: {
            en: 'Total count or -1 if unknown',
            ja: '総数、または不明な場合は -1',
          },
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Loading state (sets aria-busy)',
            ja: '読み込み状態（aria-busy を設定）',
          },
        },
      ],
      apiEvents: [
        {
          name: 'feed:loadmore',
          detail: '-',
          description: {
            en: 'Dispatched to load more articles',
            ja: '追加読み込み時にディスパッチ',
          },
        },
        {
          name: 'feed:focuschange',
          detail: '{ articleId: string, index: number }',
          description: {
            en: 'Dispatched when focus changes',
            ja: 'フォーカス変更時にディスパッチ',
          },
        },
      ],
    },
  },
};

export default feedMeta;
