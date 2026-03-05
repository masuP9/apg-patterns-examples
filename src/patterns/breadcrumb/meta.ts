import type { PatternMeta } from '@/lib/pattern-meta-types';

const breadcrumbMeta: PatternMeta = {
  title: {
    en: 'Breadcrumb',
    ja: 'Breadcrumb',
  },
  description: {
    en: "A navigation pattern that shows the user's current location within a site hierarchy.",
    ja: 'サイト階層内でのユーザーの現在位置を示すナビゲーションパターン。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
      label: {
        en: 'WAI-ARIA APG: Breadcrumb Pattern',
        ja: 'WAI-ARIA APG: Breadcrumb パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_cookbook/Breadcrumb_Navigation',
      label: {
        en: 'MDN: Breadcrumb Navigation',
        ja: 'MDN: Breadcrumb Navigation',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Breadcrumb.tsx',
      lang: 'tsx',
      usageCode: `import { Breadcrumb } from './Breadcrumb';

function App() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Current Product' }
      ]}
    />
  );
}`,
      apiProps: [
        {
          name: 'items',
          type: 'BreadcrumbItem[]',
          default: 'required',
          description: {
            en: 'Array of breadcrumb items',
            ja: 'パンくずリストアイテムの配列',
          },
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '"Breadcrumb"',
          description: {
            en: 'Accessible label for the navigation',
            ja: 'ナビゲーションのアクセシブルラベル',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Breadcrumb.vue',
      lang: 'vue',
      usageCode: `<script setup>
import Breadcrumb from './Breadcrumb.vue';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Current Product' }
];
</script>

<template>
  <Breadcrumb :items="items" />
</template>`,
      apiProps: [
        {
          name: 'items',
          type: 'BreadcrumbItem[]',
          default: 'required',
          description: {
            en: 'Array of breadcrumb items',
            ja: 'Breadcrumb アイテムの配列',
          },
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '"Breadcrumb"',
          description: {
            en: 'Accessible label for the navigation',
            ja: 'ナビゲーションのアクセシブルなラベル',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Breadcrumb.svelte',
      lang: 'svelte',
      usageCode: `<script>
  import Breadcrumb from './Breadcrumb.svelte';

  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Product' }
  ];
</script>

<Breadcrumb {items} />`,
      apiProps: [
        {
          name: 'items',
          type: 'BreadcrumbItem[]',
          default: 'required',
          description: {
            en: 'Array of breadcrumb items',
            ja: 'パンくずリストアイテムの配列',
          },
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '"Breadcrumb"',
          description: {
            en: 'Accessible label for the navigation',
            ja: 'ナビゲーションのアクセシブルなラベル',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Breadcrumb.astro',
      lang: 'astro',
      usageCode: `---
import Breadcrumb from './Breadcrumb.astro';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Current Product' }
];
---

<Breadcrumb items={items} />`,
      apiProps: [
        {
          name: 'items',
          type: 'BreadcrumbItem[]',
          default: 'required',
          description: {
            en: 'Array of breadcrumb items',
            ja: 'パンくずリストアイテムの配列',
          },
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '"Breadcrumb"',
          description: {
            en: 'Accessible label for the navigation',
            ja: 'ナビゲーションのアクセシブルラベル',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class',
            ja: '追加の CSS クラス',
          },
        },
      ],
    },
  },
};

export default breadcrumbMeta;
