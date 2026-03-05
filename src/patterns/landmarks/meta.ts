import type { PatternMeta } from '@/lib/pattern-meta-types';

const landmarksMeta: PatternMeta = {
  title: {
    en: 'Landmarks',
    ja: 'ランドマーク',
  },
  description: {
    en: 'A set of eight ARIA landmark roles that identify the major sections of a page for assistive technology users.',
    ja: 'ページの主要セクションを識別する8つのARIAランドマークロールのセット。支援技術ユーザーのナビゲーションを効率化します。',
  },
  tocItems: {
    en: [
      { id: 'demo', text: 'Demo' },
      { id: 'native-html', text: 'Native HTML' },
      { id: 'accessibility-features', text: 'Accessibility Features' },
      { id: 'source-code', text: 'Source Code' },
      { id: 'testing', text: 'Testing' },
      { id: 'resources', text: 'Resources' },
    ],
    ja: [
      { id: 'demo', text: 'デモ' },
      { id: 'native-html', text: 'ネイティブ HTML' },
      { id: 'accessibility-features', text: 'アクセシビリティ機能' },
      { id: 'source-code', text: 'ソースコード' },
      { id: 'testing', text: 'テスト' },
      { id: 'resources', text: 'リソース' },
    ],
  },
  hasNativeHtmlNotice: true,
  resources: [
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/',
      label: {
        en: 'WAI-ARIA APG: Landmarks Pattern',
        ja: 'WAI-ARIA APG: ランドマークパターン',
      },
    },
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
      label: {
        en: 'WAI-ARIA APG: Landmark Regions',
        ja: 'WAI-ARIA APG: ランドマーク領域',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role',
      label: {
        en: 'MDN: ARIA Landmark Roles',
        ja: 'MDN: ARIA ランドマークロール',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'LandmarkDemo.tsx',
      testFile: 'LandmarkDemo.test.tsx',
      lang: 'tsx',
      usageCode: `import { LandmarkDemo } from './LandmarkDemo';

function App() {
  return <LandmarkDemo showLabels={true} />;
}`,
      apiProps: [
        {
          name: 'showLabels',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether to show landmark role labels',
            ja: 'ランドマークロールのラベルを表示するかどうか',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'LandmarkDemo.vue',
      testFile: 'LandmarkDemo.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import LandmarkDemo from './LandmarkDemo.vue';
</script>

<template>
  <LandmarkDemo :showLabels="true" />
</template>`,
      apiProps: [
        {
          name: 'showLabels',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether to show landmark role labels',
            ja: 'ランドマークロールのラベルを表示するかどうか',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'LandmarkDemo.svelte',
      testFile: 'LandmarkDemo.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import LandmarkDemo from './LandmarkDemo.svelte';
</script>

<LandmarkDemo showLabels={true} />`,
      apiProps: [
        {
          name: 'showLabels',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether to show landmark role labels',
            ja: 'ランドマークロールのラベルを表示するかどうか',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'LandmarkDemo.astro',
      testFile: 'LandmarkDemo.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import LandmarkDemo from './LandmarkDemo.astro';
---

<LandmarkDemo showLabels={true} />`,
      apiProps: [
        {
          name: 'showLabels',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether to show landmark role labels',
            ja: 'ランドマークロールのラベルを表示するかどうか',
          },
        },
      ],
    },
  },
};

export default landmarksMeta;
