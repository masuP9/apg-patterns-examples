import type { PatternMeta } from '@/lib/pattern-meta-types';

const tooltipMeta: PatternMeta = {
  title: {
    en: 'Tooltip',
    ja: 'Tooltip',
  },
  description: {
    en: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    ja: '要素がキーボードフォーカスを受けたとき、またはマウスがホバーしたときに、要素に関連する情報を表示するポップアップ。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/',
      label: {
        en: 'WAI-ARIA APG: Tooltip Pattern',
        ja: 'WAI-ARIA APG: Tooltip パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Tooltip.tsx',
      testFile: 'Tooltip.test.tsx',
      lang: 'tsx',
      usageCode: `import { Tooltip } from './Tooltip';

function App() {
  return (
    <Tooltip
      content="Save your changes"
      placement="top"
      delay={300}
    >
      <button>Save</button>
    </Tooltip>
  );
}`,
      apiProps: [
        {
          name: 'content',
          type: 'ReactNode',
          default: '-',
          description: {
            en: 'Tooltip content (required)',
            ja: 'ツールチップの内容（必須）',
          },
        },
        {
          name: 'children',
          type: 'ReactNode',
          default: '-',
          description: {
            en: 'Trigger element (required)',
            ja: 'トリガー要素（必須）',
          },
        },
        {
          name: 'open',
          type: 'boolean',
          default: '-',
          description: {
            en: 'Controlled open state',
            ja: '制御された開閉状態',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Default open state (uncontrolled)',
            ja: 'デフォルトの開閉状態（非制御）',
          },
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when open state changes',
            ja: '開閉状態が変更されたときのコールバック',
          },
        },
        {
          name: 'delay',
          type: 'number',
          default: '300',
          description: {
            en: 'Delay before showing (ms)',
            ja: '表示までの遅延時間（ミリ秒）',
          },
        },
        {
          name: 'placement',
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'top'",
          description: {
            en: 'Tooltip position relative to trigger',
            ja: 'トリガーに対するツールチップの位置',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: 'auto-generated',
          description: {
            en: 'Custom ID for SSR',
            ja: 'SSR用のカスタムID',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disable the tooltip',
            ja: 'ツールチップを無効化',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Tooltip.vue',
      testFile: 'Tooltip.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Tooltip from './Tooltip.vue';
</script>

<template>
  <Tooltip
    content="Save your changes"
    placement="top"
    :delay="300"
  >
    <button>Save</button>
  </Tooltip>
</template>`,
      apiProps: [
        {
          name: 'content',
          type: 'string',
          default: '-',
          description: {
            en: 'Tooltip content (required)',
            ja: 'ツールチップのコンテンツ（必須）',
          },
        },
        {
          name: 'open',
          type: 'boolean',
          default: '-',
          description: {
            en: 'Controlled open state (v-model:open)',
            ja: '制御された開いた状態（v-model:open）',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Default open state (uncontrolled)',
            ja: 'デフォルトの開いた状態（非制御）',
          },
        },
        {
          name: 'delay',
          type: 'number',
          default: '300',
          description: {
            en: 'Delay before showing (ms)',
            ja: '表示前の遅延時間（ミリ秒）',
          },
        },
        {
          name: 'placement',
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'top'",
          description: {
            en: 'Tooltip position',
            ja: 'ツールチップの位置',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: 'auto-generated',
          description: {
            en: 'Custom ID',
            ja: 'カスタム ID',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disable the tooltip',
            ja: 'ツールチップを無効にする',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Tooltip.svelte',
      testFile: 'Tooltip.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Tooltip from './Tooltip.svelte';
</script>

<!-- Basic usage with render props for aria-describedby -->
<Tooltip
  id="tooltip-save"
  content="Save your changes"
  placement="top"
  delay={300}
>
  {#snippet children({ describedBy })}
    <button aria-describedby={describedBy}>Save</button>
  {/snippet}
</Tooltip>

<!-- Rich content using Snippet -->
<Tooltip id="tooltip-shortcut">
  {#snippet content()}
    <span class="flex items-center gap-1">
      <kbd>Ctrl</kbd>+<kbd>S</kbd>
    </span>
  {/snippet}
  {#snippet children({ describedBy })}
    <button aria-describedby={describedBy}>Keyboard shortcut</button>
  {/snippet}
</Tooltip>`,
      apiProps: [
        {
          name: 'id',
          type: 'string',
          default: '-',
          description: {
            en: 'Unique ID for the tooltip (required for SSR/hydration consistency)',
            ja: 'ツールチップの一意の ID（SSR/ハイドレーション一貫性のために必須）',
          },
        },
        {
          name: 'content',
          type: 'string | Snippet',
          default: '-',
          description: {
            en: 'Tooltip content (required)',
            ja: 'ツールチップの内容（必須）',
          },
        },
        {
          name: 'children',
          type: 'Snippet<[{ describedBy }]>',
          default: '-',
          description: {
            en: 'Render props pattern - receives describedBy for aria-describedby',
            ja: 'レンダープロパティパターン - aria-describedby 用の describedBy を受け取る',
          },
        },
        {
          name: 'open',
          type: 'boolean',
          default: '-',
          description: {
            en: 'Controlled open state',
            ja: '制御された開閉状態',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Default open state (uncontrolled)',
            ja: 'デフォルトの開閉状態（非制御）',
          },
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when open state changes',
            ja: '開閉状態変更時のコールバック',
          },
        },
        {
          name: 'delay',
          type: 'number',
          default: '300',
          description: {
            en: 'Delay before showing (ms)',
            ja: '表示前の遅延時間（ミリ秒）',
          },
        },
        {
          name: 'placement',
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'top'",
          description: {
            en: 'Tooltip position',
            ja: 'ツールチップの位置',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disable the tooltip',
            ja: 'ツールチップを無効にする',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Tooltip.astro',
      lang: 'astro',
      usageCode: `---
import Tooltip from './Tooltip.astro';
---

<Tooltip
  content="Save your changes"
  placement="top"
  delay={300}
>
  <button>Save</button>
</Tooltip>`,
      apiProps: [
        {
          name: 'content',
          type: 'string',
          default: '-',
          description: {
            en: 'Tooltip content (required)',
            ja: 'ツールチップの内容（必須）',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Default open state',
            ja: 'デフォルトの開閉状態',
          },
        },
        {
          name: 'delay',
          type: 'number',
          default: '300',
          description: {
            en: 'Delay before showing (ms)',
            ja: '表示までの遅延時間（ミリ秒）',
          },
        },
        {
          name: 'placement',
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'top'",
          description: {
            en: 'Tooltip position',
            ja: 'ツールチップの位置',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: 'auto-generated',
          description: {
            en: 'Custom ID',
            ja: 'カスタム ID',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disable the tooltip',
            ja: 'ツールチップを無効化',
          },
        },
      ],
      apiNote: {
        en: 'This implementation uses a Web Component (<code>&lt;apg-tooltip&gt;</code>) for client-side interactivity.',
        ja: 'この実装は、クライアント側のインタラクティブ性のために Web Component（<code>&lt;apg-tooltip&gt;</code>）を使用しています。',
      },
    },
  },
};

export default tooltipMeta;
