import type { PatternMeta } from '@/lib/pattern-meta-types';

const listboxMeta: PatternMeta = {
  title: {
    en: 'Listbox',
    ja: 'リストボックス',
  },
  description: {
    en: 'A widget that allows the user to select one or more items from a list of choices.',
    ja: 'ユーザーが選択肢のリストから1つまたは複数のアイテムを選択できるウィジェット。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
      label: {
        en: 'WAI-ARIA APG: Listbox Pattern',
        ja: 'WAI-ARIA APG: Listbox パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Listbox.tsx',
      lang: 'tsx',
      usageCode: `import { Listbox } from './Listbox';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
  { id: 'date', label: 'Date', disabled: true },
];

// Single-select (selection follows focus)
<Listbox
  options={options}
  aria-label="Choose a fruit"
  onSelectionChange={(ids) => console.log('Selected:', ids)}
/>

// Multi-select
<Listbox
  options={options}
  multiselectable
  aria-label="Choose fruits"
  onSelectionChange={(ids) => console.log('Selected:', ids)}
/>

// Horizontal orientation
<Listbox
  options={options}
  orientation="horizontal"
  aria-label="Choose a fruit"
/>`,
      apiProps: [
        {
          name: 'options',
          type: 'ListboxOption[]',
          default: 'required',
          description: {
            en: 'Array of options',
            ja: 'オプションの配列',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-select mode',
            ja: 'マルチ選択モードを有効化',
          },
        },
        {
          name: 'orientation',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: {
            en: 'Listbox orientation',
            ja: 'リストボックスの方向',
          },
        },
        {
          name: 'defaultSelectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially selected option IDs',
            ja: '初期選択されるオプション ID',
          },
        },
        {
          name: 'onSelectionChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Callback when selection changes',
            ja: '選択変更時のコールバック',
          },
        },
        {
          name: 'typeAheadTimeout',
          type: 'number',
          default: '500',
          description: {
            en: 'Type-ahead timeout in milliseconds',
            ja: '先行入力のタイムアウト（ミリ秒）',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Listbox.vue',
      lang: 'vue',
      usageCode: `<script setup>
import Listbox from './Listbox.vue';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
];

const handleSelectionChange = (ids) => {
  console.log('Selected:', ids);
};
</script>

<template>
  <!-- Single-select -->
  <Listbox
    :options="options"
    aria-label="Choose a fruit"
    @selection-change="handleSelectionChange"
  />

  <!-- Multi-select -->
  <Listbox
    :options="options"
    multiselectable
    aria-label="Choose fruits"
    @selection-change="handleSelectionChange"
  />
</template>`,
      apiProps: [
        {
          name: 'options',
          type: 'ListboxOption[]',
          default: 'required',
          description: {
            en: 'Array of options',
            ja: 'オプションの配列',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-select mode',
            ja: '複数選択モードを有効化',
          },
        },
        {
          name: 'orientation',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: {
            en: 'Listbox orientation',
            ja: 'Listbox の方向',
          },
        },
        {
          name: 'defaultSelectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially selected option IDs',
            ja: '初期選択されたオプション ID',
          },
        },
      ],
      apiEvents: [
        {
          name: 'selection-change',
          detail: 'string[]',
          description: {
            en: 'Emitted when selection changes',
            ja: '選択が変更されたときに発行',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Listbox.svelte',
      lang: 'svelte',
      usageCode: `<script>
  import Listbox from './Listbox.svelte';

  const options = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
  ];

  function handleSelectionChange(ids) {
    console.log('Selected:', ids);
  }
</script>

<!-- Single-select -->
<Listbox
  {options}
  ariaLabel="Choose a fruit"
  onSelectionChange={handleSelectionChange}
/>

<!-- Multi-select -->
<Listbox
  {options}
  multiselectable
  ariaLabel="Choose fruits"
  onSelectionChange={handleSelectionChange}
/>`,
      apiProps: [
        {
          name: 'options',
          type: 'ListboxOption[]',
          default: 'required',
          description: {
            en: 'Array of options',
            ja: 'オプションの配列',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-select mode',
            ja: 'マルチ選択モードを有効化',
          },
        },
        {
          name: 'orientation',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: {
            en: 'Listbox orientation',
            ja: 'Listboxの方向',
          },
        },
        {
          name: 'defaultSelectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially selected option IDs',
            ja: '初期選択されるオプションのID',
          },
        },
        {
          name: 'onSelectionChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Callback when selection changes',
            ja: '選択変更時のコールバック',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Listbox.astro',
      lang: 'astro',
      usageCode: `---
import Listbox from '@patterns/listbox/Listbox.astro';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
];
---

<!-- Single-select -->
<Listbox
  options={options}
  aria-label="Choose a fruit"
/>

<!-- Multi-select -->
<Listbox
  options={options}
  multiselectable
  aria-label="Choose fruits"
/>

<!-- Listen for selection changes -->
<script>
  document.querySelector('apg-listbox')?.addEventListener('selectionchange', (e) => {
    console.log('Selected:', e.detail.selectedIds);
  });
</script>`,
      apiProps: [
        {
          name: 'options',
          type: 'ListboxOption[]',
          default: 'required',
          description: {
            en: 'Array of options',
            ja: 'オプションの配列',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-select mode',
            ja: '複数選択モードを有効化',
          },
        },
        {
          name: 'orientation',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: {
            en: 'Listbox orientation',
            ja: 'リストボックスの方向',
          },
        },
        {
          name: 'defaultSelectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially selected option IDs',
            ja: '初期選択されたオプション ID',
          },
        },
      ],
      apiEvents: [
        {
          name: 'selectionchange',
          detail: '{ selectedIds: string[] }',
          description: {
            en: 'Fired when selection changes',
            ja: '選択が変更されたときに発火',
          },
        },
      ],
    },
  },
};

export default listboxMeta;
