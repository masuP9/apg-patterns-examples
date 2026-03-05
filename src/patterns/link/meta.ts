import type { PatternMeta } from '@/lib/pattern-meta-types';

const linkMeta: PatternMeta = {
  title: {
    en: 'Link',
    ja: 'リンク',
  },
  description: {
    en: 'An interactive element that navigates to a resource when activated.',
    ja: 'アクティブ化されたときにリソースにナビゲートするインタラクティブ要素。',
  },
  tocItems: {
    en: [
      { id: 'demo', text: 'Demo' },
      { id: 'native-html', text: 'Native HTML' },
      { id: 'accessibility-features', text: 'Accessibility Features' },
      { id: 'source-code', text: 'Source Code' },
      { id: 'usage', text: 'Usage' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'Testing' },
      { id: 'resources', text: 'Resources' },
    ],
    ja: [
      { id: 'demo', text: 'デモ' },
      { id: 'native-html', text: 'ネイティブ HTML' },
      { id: 'accessibility-features', text: 'アクセシビリティ機能' },
      { id: 'source-code', text: 'ソースコード' },
      { id: 'usage', text: '使い方' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'テスト' },
      { id: 'resources', text: 'リソース' },
    ],
  },
  hasNativeHtmlNotice: true,
  resources: [
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/link/',
      label: {
        en: 'WAI-ARIA APG: Link Pattern',
        ja: 'WAI-ARIA APG: Link パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
      label: {
        en: 'MDN: <a> element',
        ja: 'MDN: <a> 要素',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Link.tsx',
      testFile: 'Link.test.tsx',
      lang: 'tsx',
      usageCode: `import { Link } from './Link';

function App() {
  return (
    <div>
      {/* Basic link */}
      <Link href="https://example.com">Visit Example</Link>

      {/* Open in new tab */}
      <Link href="https://example.com" target="_blank">
        External Link
      </Link>

      {/* With onClick handler */}
      <Link onClick={(e) => console.log('Clicked', e)}>
        Interactive Link
      </Link>

      {/* Disabled link */}
      <Link href="#" disabled>
        Unavailable Link
      </Link>

      {/* With aria-label for icon links */}
      <Link href="/" aria-label="Home">
        <HomeIcon />
      </Link>
    </div>
  );
}`,
      apiProps: [
        {
          name: 'href',
          type: 'string',
          default: '-',
          description: {
            en: 'Link destination URL',
            ja: 'リンク先のURL',
          },
        },
        {
          name: 'target',
          type: "'_self' | '_blank'",
          default: "'_self'",
          description: {
            en: 'Where to open the link',
            ja: 'リンクを開く場所',
          },
        },
        {
          name: 'onClick',
          type: '(event) => void',
          default: '-',
          description: {
            en: 'Click/Enter event handler',
            ja: 'クリック/Enterイベントハンドラ',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the link is disabled',
            ja: 'リンクが無効かどうか',
          },
        },
        {
          name: 'children',
          type: 'ReactNode',
          default: '-',
          description: {
            en: 'Link content',
            ja: 'リンクのコンテンツ',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;span&gt;</code> element.',
        ja: 'その他のプロパティは、内部の <code>&lt;span&gt;</code> 要素に渡されます。',
      },
    },
    vue: {
      sourceFile: 'Link.vue',
      testFile: 'Link.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Link from './Link.vue';
</script>

<template>
  <!-- Basic link -->
  <Link href="https://example.com">Visit Example</Link>

  <!-- Open in new tab -->
  <Link href="https://example.com" target="_blank">
    External Link
  </Link>

  <!-- With onClick handler -->
  <Link @click="handleClick">Interactive Link</Link>

  <!-- Disabled link -->
  <Link href="#" disabled>Unavailable Link</Link>
</template>`,
      apiProps: [
        {
          name: 'href',
          type: 'string',
          default: '-',
          description: {
            en: 'Link destination URL',
            ja: 'リンク先 URL',
          },
        },
        {
          name: 'target',
          type: "'_self' | '_blank'",
          default: "'_self'",
          description: {
            en: 'Where to open the link',
            ja: 'リンクを開く場所',
          },
        },
        {
          name: 'onClick',
          type: '(event) => void',
          default: '-',
          description: {
            en: 'Click/Enter event handler',
            ja: 'クリック/Enter イベントハンドラー',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the link is disabled',
            ja: 'リンクが無効かどうか',
          },
        },
      ],
      apiNote: {
        en: 'All other attributes are passed to the underlying <code>&lt;span&gt;</code> element via <code>$attrs</code>.',
        ja: 'その他のすべての属性は、<code>$attrs</code> を介して内部の <code>&lt;span&gt;</code> 要素に渡されます。',
      },
    },
    svelte: {
      sourceFile: 'Link.svelte',
      testFile: 'Link.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Link from './Link.svelte';

  function handleClick(event) {
    console.log('Link clicked', event);
  }
</script>

<!-- Basic link -->
<Link href="https://example.com">Visit Example</Link>

<!-- Open in new tab -->
<Link href="https://example.com" target="_blank">
  External Link
</Link>

<!-- With onClick handler -->
<Link onClick={handleClick}>Interactive Link</Link>

<!-- Disabled link -->
<Link href="#" disabled>Unavailable Link</Link>`,
      apiProps: [
        {
          name: 'href',
          type: 'string',
          default: '-',
          description: {
            en: 'Link destination URL',
            ja: 'リンク先のURL',
          },
        },
        {
          name: 'target',
          type: "'_self' | '_blank'",
          default: "'_self'",
          description: {
            en: 'Where to open the link',
            ja: 'リンクを開く場所',
          },
        },
        {
          name: 'onClick',
          type: '(event) => void',
          default: '-',
          description: {
            en: 'Click/Enter event handler',
            ja: 'クリック/Enterイベントハンドラー',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the link is disabled',
            ja: 'リンクが無効化されているかどうか',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;span&gt;</code> element via <code>restProps</code>.',
        ja: 'その他のプロパティは、<code>restProps</code> 経由で内部の <code>&lt;span&gt;</code> 要素に渡されます。',
      },
    },
    astro: {
      sourceFile: 'Link.astro',
      testFile: 'Link.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Link from './Link.astro';
---

<!-- Basic link -->
<Link href="https://example.com">Visit Example</Link>

<!-- Open in new tab -->
<Link href="https://example.com" target="_blank">
  External Link
</Link>

<!-- Disabled link -->
<Link href="#" disabled>Unavailable Link</Link>

<!-- With custom event listener (JavaScript) -->
<Link href="#" id="interactive-link">Interactive Link</Link>

<script>
  document.getElementById('interactive-link')
    ?.addEventListener('link-activate', (e) => {
      console.log('Link activated', e.detail);
    });
</script>`,
      apiProps: [
        {
          name: 'href',
          type: 'string',
          default: '-',
          description: {
            en: 'Link destination URL',
            ja: 'リンク先 URL',
          },
        },
        {
          name: 'target',
          type: "'_self' | '_blank'",
          default: "'_self'",
          description: {
            en: 'Where to open the link',
            ja: 'リンクを開く場所',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the link is disabled',
            ja: 'リンクが無効化されているかどうか',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS classes',
            ja: '追加の CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'link-activate',
          detail: '{ href, target }',
          description: {
            en: 'Fired when link is activated (click or Enter)',
            ja: 'リンクがアクティベートされたとき（クリックまたは Enter）に発火',
          },
        },
      ],
    },
  },
};

export default linkMeta;
