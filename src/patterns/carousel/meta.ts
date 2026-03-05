import type { PatternMeta } from '@/lib/pattern-meta-types';

const carouselMeta: PatternMeta = {
  title: {
    en: 'Carousel',
    ja: 'Carousel',
  },
  description: {
    en: 'A rotating set of content items (slides) displayed one at a time with controls to navigate between them.',
    ja: '回転するコンテンツアイテム（スライド）のセットで、一度に1つずつ表示し、ナビゲーションコントロールで切り替えます。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/carousel/',
      label: {
        en: 'WAI-ARIA APG: Carousel Pattern',
        ja: 'WAI-ARIA APG: Carousel パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Carousel.tsx',
      testFile: 'Carousel.test.tsx',
      lang: 'tsx',
      usageCode: `import { Carousel } from './Carousel';

const slides = [
  { id: 'slide1', content: '<p>Slide 1 content</p>', label: 'First slide' },
  { id: 'slide2', content: '<p>Slide 2 content</p>', label: 'Second slide' },
  { id: 'slide3', content: '<p>Slide 3 content</p>', label: 'Third slide' }
];

function App() {
  return (
    <Carousel
      slides={slides}
      aria-label="Featured content"
      autoRotate={true}
      rotationInterval={5000}
      onSlideChange={(index) => console.log('Slide changed:', index)}
    />
  );
}`,
      apiProps: [
        {
          name: 'slides',
          type: 'CarouselSlide[]',
          default: 'required',
          description: {
            en: 'Array of slide items',
            ja: 'スライドアイテムの配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: 'required',
          description: {
            en: 'Accessible name for the carousel',
            ja: 'カルーセルのアクセシブルな名前',
          },
        },
        {
          name: 'initialSlide',
          type: 'number',
          default: '0',
          description: {
            en: 'Initial slide index (0-based)',
            ja: '初期スライドのインデックス（0から開始）',
          },
        },
        {
          name: 'autoRotate',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable auto-rotation',
            ja: '自動回転を有効にする',
          },
        },
        {
          name: 'rotationInterval',
          type: 'number',
          default: '5000',
          description: {
            en: 'Rotation interval in milliseconds',
            ja: '回転間隔（ミリ秒）',
          },
        },
        {
          name: 'onSlideChange',
          type: '(index: number) => void',
          default: '-',
          description: {
            en: 'Callback when slide changes',
            ja: 'スライド変更時のコールバック',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Carousel.vue',
      testFile: 'Carousel.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import Carousel from './Carousel.vue';

const slides = [
  { id: 'slide1', content: '<p>Slide 1 content</p>', label: 'First slide' },
  { id: 'slide2', content: '<p>Slide 2 content</p>', label: 'Second slide' },
  { id: 'slide3', content: '<p>Slide 3 content</p>', label: 'Third slide' }
];

function handleSlideChange(index: number) {
  console.log('Slide changed:', index);
}
</script>

<template>
  <Carousel
    :slides="slides"
    aria-label="Featured content"
    :auto-rotate="true"
    :rotation-interval="5000"
    @slide-change="handleSlideChange"
  />
</template>`,
      apiProps: [
        {
          name: 'slides',
          type: 'CarouselSlide[]',
          default: 'required',
          description: {
            en: 'Array of slide items',
            ja: 'スライドアイテムの配列',
          },
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: 'required',
          description: {
            en: 'Accessible name for the carousel',
            ja: 'カルーセルのアクセシブルな名前',
          },
        },
        {
          name: 'initialSlide',
          type: 'number',
          default: '0',
          description: {
            en: 'Initial slide index (0-based)',
            ja: '初期スライドのインデックス（0から開始）',
          },
        },
        {
          name: 'autoRotate',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable auto-rotation',
            ja: '自動回転を有効にする',
          },
        },
        {
          name: 'rotationInterval',
          type: 'number',
          default: '5000',
          description: {
            en: 'Rotation interval in milliseconds',
            ja: '回転間隔（ミリ秒）',
          },
        },
      ],
      apiEvents: [
        {
          name: 'slide-change',
          detail: 'number',
          description: {
            en: 'Emitted when slide changes (index)',
            ja: 'スライド変更時に発火（インデックス）',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Carousel.svelte',
      testFile: 'Carousel.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import Carousel from './Carousel.svelte';

  const slides = [
    { id: 'slide1', content: '<p>Slide 1 content</p>', label: 'First slide' },
    { id: 'slide2', content: '<p>Slide 2 content</p>', label: 'Second slide' },
    { id: 'slide3', content: '<p>Slide 3 content</p>', label: 'Third slide' }
  ];

  function handleSlideChange(index: number) {
    console.log('Slide changed:', index);
  }
</script>

<Carousel
  {slides}
  aria-label="Featured content"
  autoRotate={true}
  rotationInterval={5000}
  onSlideChange={handleSlideChange}
/>`,
      apiProps: [
        {
          name: 'slides',
          type: 'CarouselSlide[]',
          default: 'required',
          description: {
            en: 'Array of slide items',
            ja: 'スライドアイテムの配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: 'required',
          description: {
            en: 'Accessible name for the carousel',
            ja: 'カルーセルのアクセシブルな名前',
          },
        },
        {
          name: 'initialSlide',
          type: 'number',
          default: '0',
          description: {
            en: 'Initial slide index (0-based)',
            ja: '初期スライドのインデックス（0から開始）',
          },
        },
        {
          name: 'autoRotate',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable auto-rotation',
            ja: '自動回転を有効にする',
          },
        },
        {
          name: 'rotationInterval',
          type: 'number',
          default: '5000',
          description: {
            en: 'Rotation interval in milliseconds',
            ja: '回転間隔（ミリ秒）',
          },
        },
        {
          name: 'onSlideChange',
          type: '(index: number) => void',
          default: '-',
          description: {
            en: 'Callback when slide changes',
            ja: 'スライド変更時のコールバック',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Carousel.astro',
      testFile: 'Carousel.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Carousel from '@patterns/carousel/Carousel.astro';

const slides = [
  { id: 'slide1', content: '<p>Slide 1 content</p>', label: 'First slide' },
  { id: 'slide2', content: '<p>Slide 2 content</p>', label: 'Second slide' },
  { id: 'slide3', content: '<p>Slide 3 content</p>', label: 'Third slide' }
];
---

<Carousel
  slides={slides}
  aria-label="Featured content"
  autoRotate={true}
  rotationInterval={5000}
/>`,
      apiProps: [
        {
          name: 'slides',
          type: 'CarouselSlide[]',
          default: 'required',
          description: {
            en: 'Array of slide items',
            ja: 'スライドアイテムの配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: 'required',
          description: {
            en: 'Accessible name for the carousel',
            ja: 'カルーセルのアクセシブルな名前',
          },
        },
        {
          name: 'initialSlide',
          type: 'number',
          default: '0',
          description: {
            en: 'Initial slide index (0-based)',
            ja: '初期スライドのインデックス（0から開始）',
          },
        },
        {
          name: 'autoRotate',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable auto-rotation',
            ja: '自動回転を有効にする',
          },
        },
        {
          name: 'rotationInterval',
          type: 'number',
          default: '5000',
          description: {
            en: 'Rotation interval in milliseconds',
            ja: '回転間隔（ミリ秒）',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: 'auto-generated',
          description: {
            en: 'Instance ID for the carousel',
            ja: 'カルーセルのインスタンスID',
          },
        },
      ],
      apiEvents: [
        {
          name: 'slidechange',
          detail: '{ index: number }',
          description: {
            en: 'Dispatched when slide changes',
            ja: 'スライド変更時にディスパッチ',
          },
        },
      ],
    },
  },
};

export default carouselMeta;
