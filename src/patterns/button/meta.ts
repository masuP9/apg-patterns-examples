import type { PatternMeta } from '@/lib/pattern-meta-types';

const buttonMeta: PatternMeta = {
  title: {
    en: 'Button',
    ja: 'ボタン',
  },
  description: {
    en: 'An element that enables users to trigger an action or event using role="button".',
    ja: 'role="button" を使用してアクションやイベントをトリガーする要素。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
      label: {
        en: 'WAI-ARIA APG: Button Pattern',
        ja: 'WAI-ARIA APG: Button パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
      label: {
        en: 'MDN: <button> element',
        ja: 'MDN: <button> element',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Button.tsx',
      testFile: 'Button.test.tsx',
      lang: 'tsx',
      usageCode: `import { Button } from './Button';

function App() {
  return (
    <div>
      {/* Basic button */}
      <Button onClick={() => console.log('Clicked!')}>
        Click me
      </Button>

      {/* Disabled button */}
      <Button disabled onClick={() => alert('Should not fire')}>
        Disabled
      </Button>

      {/* With aria-label for icon buttons */}
      <Button onClick={handleSettings} aria-label="Settings">
        <SettingsIcon />
      </Button>
    </div>
  );
}`,
      apiProps: [
        {
          name: 'onClick',
          type: '(event) => void',
          default: '-',
          description: {
            en: 'Click/Space/Enter event handler',
            ja: 'クリック/Space/Enterイベントハンドラ',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the button is disabled',
            ja: 'ボタンが無効かどうか',
          },
        },
        {
          name: 'children',
          type: 'ReactNode',
          default: '-',
          description: {
            en: 'Button content',
            ja: 'ボタンのコンテンツ',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;span&gt;</code> element.',
        ja: 'その他のプロパティは、内部の <code>&lt;span&gt;</code> 要素に渡されます。',
      },
    },
    vue: {
      sourceFile: 'Button.vue',
      testFile: 'Button.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Button from './Button.vue';

const handleClick = () => {
  console.log('Clicked!');
};
</script>

<template>
  <!-- Basic button -->
  <Button :onClick="handleClick">Click me</Button>

  <!-- Disabled button -->
  <Button disabled>Disabled</Button>

  <!-- With aria-label for icon buttons -->
  <Button :onClick="handleSettings" aria-label="Settings">
    <SettingsIcon />
  </Button>
</template>`,
      apiProps: [
        {
          name: 'onClick',
          type: '(event) => void',
          default: '-',
          description: {
            en: 'Click/Space/Enter event handler',
            ja: 'クリック/Space/Enterイベントハンドラ',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the button is disabled',
            ja: 'ボタンが無効かどうか',
          },
        },
      ],
      apiNote: {
        en: 'All other attributes are passed to the underlying <code>&lt;span&gt;</code> element via <code>$attrs</code>.',
        ja: 'その他の属性は <code>$attrs</code> を通じて内部の <code>&lt;span&gt;</code> 要素に渡されます。',
      },
    },
    svelte: {
      sourceFile: 'Button.svelte',
      testFile: 'Button.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Button from './Button.svelte';

  function handleClick() {
    console.log('Clicked!');
  }
</script>

<!-- Basic button -->
<Button onClick={handleClick}>Click me</Button>

<!-- Disabled button -->
<Button disabled>Disabled</Button>

<!-- With aria-label for icon buttons -->
<Button onClick={handleSettings} aria-label="Settings">
  <SettingsIcon />
</Button>`,
      apiProps: [
        {
          name: 'onClick',
          type: '(event) => void',
          default: '-',
          description: {
            en: 'Click/Space/Enter event handler',
            ja: 'クリック/Space/Enterイベントハンドラ',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the button is disabled',
            ja: 'ボタンが無効かどうか',
          },
        },
      ],
      apiNote: {
        en: 'All other props are spread to the underlying <code>&lt;span&gt;</code> element via <code>$$restProps</code>.',
        ja: 'その他のプロパティは <code>$$restProps</code> を通じて内部の <code>&lt;span&gt;</code> 要素にスプレッドされます。',
      },
    },
    astro: {
      sourceFile: 'Button.astro',
      testFile: 'Button.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Button from './Button.astro';
---

<!-- Basic button -->
<Button>Click me</Button>

<!-- Disabled button -->
<Button disabled>Disabled</Button>

<!-- With aria-label for icon buttons -->
<Button aria-label="Settings">
  <SettingsIcon />
</Button>

<!-- With custom event listener (JavaScript) -->
<Button id="my-button">Interactive Button</Button>

<script>
  document.getElementById('my-button')
    ?.addEventListener('button-activate', (e) => {
      console.log('Button activated');
    });
</script>`,
      apiProps: [
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the button is disabled',
            ja: 'ボタンが無効かどうか',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS classes',
            ja: '追加のCSSクラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'button-activate',
          detail: '-',
          description: {
            en: 'Fired when button is activated (click, Space, or Enter)',
            ja: 'ボタンがアクティブ化された時に発火（クリック、Space、Enter）',
          },
        },
      ],
    },
  },
};

export default buttonMeta;
