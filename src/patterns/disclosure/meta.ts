import type { PatternMeta } from '@/lib/pattern-meta-types';

const disclosureMeta: PatternMeta = {
  title: {
    en: 'Disclosure',
    ja: 'Disclosure',
  },
  description: {
    en: 'A button that controls the visibility of a section of content.',
    ja: 'コンテンツセクションの表示/非表示を制御するボタン。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
      label: {
        en: 'WAI-ARIA APG: Disclosure Pattern',
        ja: 'WAI-ARIA APG: Disclosure パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details',
      label: {
        en: 'MDN: <details> element',
        ja: 'MDN: <details> element',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Disclosure.tsx',
      lang: 'tsx',
      usageCode: `import { Disclosure } from './Disclosure';

function App() {
  return (
    <Disclosure
      trigger="Show details"
      defaultExpanded={false}
      onExpandedChange={(expanded) => console.log('Expanded:', expanded)}
    >
      <p>Hidden content that can be revealed</p>
    </Disclosure>
  );
}`,
      apiProps: [
        {
          name: 'trigger',
          type: 'ReactNode',
          default: 'required',
          description: {
            en: 'Content displayed in the trigger button',
            ja: 'トリガーボタンに表示されるコンテンツ',
          },
        },
        {
          name: 'children',
          type: 'ReactNode',
          default: 'required',
          description: {
            en: 'Content displayed in the panel',
            ja: 'パネルに表示されるコンテンツ',
          },
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initially expanded state',
            ja: '初期展開状態',
          },
        },
        {
          name: 'onExpandedChange',
          type: '(expanded: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when expanded state changes',
            ja: '展開状態変更時のコールバック',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disable the disclosure',
            ja: 'ディスクロージャーを無効化',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: '""',
          description: {
            en: 'Additional CSS class',
            ja: '追加の CSS クラス',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Disclosure.vue',
      lang: 'vue',
      usageCode: `<script setup>
import Disclosure from './Disclosure.vue';
</script>

<template>
  <Disclosure
    trigger="Show details"
    :default-expanded="false"
    @expanded-change="(expanded) => console.log('Expanded:', expanded)"
  >
    <p>Hidden content that can be revealed</p>
  </Disclosure>
</template>`,
      apiProps: [
        {
          name: 'trigger',
          type: 'string',
          default: '""',
          description: {
            en: 'Content displayed in the trigger button (or use #trigger slot)',
            ja: 'トリガーボタンに表示されるコンテンツ（または #trigger スロットを使用）',
          },
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initially expanded state',
            ja: '初期展開状態',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disable the disclosure',
            ja: 'Disclosure を無効化',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: '""',
          description: {
            en: 'Additional CSS class',
            ja: '追加の CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'expandedChange',
          detail: 'boolean',
          description: {
            en: 'Emitted when expanded state changes',
            ja: '展開状態が変更されたときに発行',
          },
        },
      ],
      apiSlots: [
        {
          name: 'default',
          default: '-',
          description: {
            en: 'Content displayed in the panel',
            ja: 'パネルに表示されるコンテンツ',
          },
        },
        {
          name: '#trigger',
          default: '-',
          description: {
            en: 'Custom trigger content (alternative to trigger prop)',
            ja: 'カスタムトリガーコンテンツ（trigger プロパティの代替）',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Disclosure.svelte',
      lang: 'svelte',
      usageCode: `<script>
  import Disclosure from './Disclosure.svelte';
</script>

<Disclosure
  id="my-disclosure"
  trigger="Show details"
  defaultExpanded={false}
  onExpandedChange={(expanded) => console.log('Expanded:', expanded)}
>
  <p>Hidden content that can be revealed</p>
</Disclosure>`,
      apiProps: [
        {
          name: 'id',
          type: 'string',
          default: 'auto-generated',
          description: {
            en: 'Unique identifier for aria-controls (recommended for SSR)',
            ja: 'aria-controls用の一意の識別子（SSRでは推奨）',
          },
        },
        {
          name: 'trigger',
          type: 'string',
          default: 'required',
          description: {
            en: 'Content displayed in the trigger button',
            ja: 'トリガーボタンに表示されるコンテンツ',
          },
        },
        {
          name: 'children',
          type: 'Snippet',
          default: '-',
          description: {
            en: 'Content displayed in the panel',
            ja: 'パネルに表示されるコンテンツ',
          },
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initially expanded state',
            ja: '初期展開状態',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disable the disclosure',
            ja: 'Disclosure を無効化',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: '""',
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
        {
          name: 'onExpandedChange',
          type: '(expanded: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when expanded state changes',
            ja: '展開状態変更時のコールバック',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Disclosure.astro',
      lang: 'astro',
      usageCode: `---
import Disclosure from './Disclosure.astro';
---

<Disclosure trigger="Show details" defaultExpanded={false}>
  <p>Hidden content that can be revealed</p>
</Disclosure>`,
      apiProps: [
        {
          name: 'trigger',
          type: 'string',
          default: 'required',
          description: {
            en: 'Content displayed in the trigger button',
            ja: 'トリガーボタンに表示されるコンテンツ',
          },
        },
        {
          name: 'slot (default)',
          type: 'any',
          default: '-',
          description: {
            en: 'Content displayed in the panel',
            ja: 'パネルに表示されるコンテンツ',
          },
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initially expanded state',
            ja: '初期展開状態',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disable the disclosure',
            ja: 'ディスクロージャーを無効化',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '""',
          description: {
            en: 'Additional CSS class',
            ja: '追加の CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'expandedchange',
          detail: '{ expanded: boolean }',
          description: {
            en: 'Dispatched when expanded state changes',
            ja: '展開状態が変更されたときにディスパッチ',
          },
        },
      ],
    },
  },
};

export default disclosureMeta;
