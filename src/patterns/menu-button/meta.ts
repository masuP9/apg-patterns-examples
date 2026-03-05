import type { PatternMeta } from '@/lib/pattern-meta-types';

const menuButtonMeta: PatternMeta = {
  title: {
    en: 'Menu Button',
    ja: 'Menu Button',
  },
  description: {
    en: 'A button that opens a menu of actions or options.',
    ja: 'アクションやオプションのメニューを開くボタン。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/',
      label: {
        en: 'WAI-ARIA APG: Menu Button Pattern',
        ja: 'WAI-ARIA APG: Menu Button パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'MenuButton.tsx',
      testFile: 'MenuButton.test.tsx',
      lang: 'tsx',
      usageCode: `import { MenuButton } from './MenuButton';

const items = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete', disabled: true },
];

// Basic usage
<MenuButton
  items={items}
  label="Actions"
  onItemSelect={(id) => console.log('Selected:', id)}
/>

// With default open state
<MenuButton
  items={items}
  label="Actions"
  defaultOpen
  onItemSelect={(id) => console.log('Selected:', id)}
/>`,
      apiProps: [
        {
          name: 'items',
          type: 'MenuItem[]',
          default: 'required',
          description: {
            en: 'Array of menu items',
            ja: 'メニュー項目の配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: 'required',
          description: {
            en: 'Button label text',
            ja: 'ボタンのラベルテキスト',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether menu is initially open',
            ja: '初期状態でメニューを開くかどうか',
          },
        },
        {
          name: 'onItemSelect',
          type: '(id: string) => void',
          default: '-',
          description: {
            en: 'Callback when an item is selected',
            ja: '項目選択時のコールバック',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class for the container',
            ja: 'コンテナの追加 CSS クラス',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'MenuButton.vue',
      testFile: 'MenuButton.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import MenuButton from './MenuButton.vue';

const items = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete', disabled: true },
];

const handleItemSelect = (itemId: string) => {
  console.log('Selected:', itemId);
};
</script>

<template>
  <!-- Basic usage -->
  <MenuButton
    :items="items"
    label="Actions"
    @item-select="handleItemSelect"
  />

  <!-- With default open state -->
  <MenuButton
    :items="items"
    label="Actions"
    default-open
    @item-select="handleItemSelect"
  />
</template>`,
      apiProps: [
        {
          name: 'items',
          type: 'MenuItem[]',
          default: 'required',
          description: {
            en: 'Array of menu items',
            ja: 'メニュー項目の配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: 'required',
          description: {
            en: 'Button label text',
            ja: 'ボタンのラベルテキスト',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether menu is initially open',
            ja: 'メニューが初期状態で開いているかどうか',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class for the container',
            ja: 'コンテナの追加 CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'item-select',
          detail: 'string',
          description: {
            en: 'Emitted when a menu item is selected',
            ja: 'メニュー項目が選択されたときに発行されます',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'MenuButton.svelte',
      testFile: 'MenuButton.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import MenuButton from './MenuButton.svelte';

  const items = [
    { id: 'cut', label: 'Cut' },
    { id: 'copy', label: 'Copy' },
    { id: 'paste', label: 'Paste' },
    { id: 'delete', label: 'Delete', disabled: true },
  ];

  function handleItemSelect(itemId: string) {
    console.log('Selected:', itemId);
  }
</script>

<!-- Basic usage -->
<MenuButton {items} label="Actions" onItemSelect={handleItemSelect} />

<!-- With default open state -->
<MenuButton {items} label="Actions" defaultOpen onItemSelect={handleItemSelect} />`,
      apiProps: [
        {
          name: 'items',
          type: 'MenuItem[]',
          default: 'required',
          description: {
            en: 'Array of menu items',
            ja: 'メニュー項目の配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: 'required',
          description: {
            en: 'Button label text',
            ja: 'ボタンのラベルテキスト',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether menu is initially open',
            ja: 'メニューが初期状態で開いているかどうか',
          },
        },
        {
          name: 'onItemSelect',
          type: '(id: string) => void',
          default: '-',
          description: {
            en: 'Callback when an item is selected',
            ja: '項目が選択されたときのコールバック',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class for the container',
            ja: 'コンテナの追加 CSS クラス',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'MenuButton.astro',
      testFile: 'MenuButton.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import MenuButton from './MenuButton.astro';

const items = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete', disabled: true },
];
---

<!-- Basic usage -->
<MenuButton items={items} label="Actions" />

<script>
  // Handle selection via custom event
  document.querySelectorAll('apg-menu-button').forEach((menuButton) => {
    menuButton.addEventListener('itemselect', (e) => {
      const event = e as CustomEvent<{ itemId: string }>;
      console.log('Selected:', event.detail.itemId);
    });
  });
</script>`,
      apiProps: [
        {
          name: 'items',
          type: 'MenuItem[]',
          default: 'required',
          description: {
            en: 'Array of menu items',
            ja: 'メニュー項目の配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: 'required',
          description: {
            en: 'Button label text',
            ja: 'ボタンのラベルテキスト',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether menu is initially open',
            ja: 'メニューが初期状態で開いているかどうか',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class for the container',
            ja: 'コンテナの追加 CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'itemselect',
          detail: '{ itemId: string }',
          description: {
            en: 'Dispatched when a menu item is selected',
            ja: 'メニュー項目が選択されたときに発行される',
          },
        },
      ],
    },
  },
};

export default menuButtonMeta;
