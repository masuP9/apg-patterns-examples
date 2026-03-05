import type { PatternMeta } from '@/lib/pattern-meta-types';

const menubarMeta: PatternMeta = {
  title: {
    en: 'Menubar',
    ja: 'メニューバー',
  },
  description: {
    en: 'A horizontal menu bar that provides application-style navigation with dropdown menus, submenus, checkbox items, and radio groups.',
    ja: 'ドロップダウンメニュー、サブメニュー、チェックボックス、ラジオグループをサポートする、アプリケーションスタイルの水平メニューバー。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/menubar/',
      label: {
        en: 'WAI-ARIA APG: Menubar Pattern',
        ja: 'WAI-ARIA APG: Menubar パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Menubar.tsx',
      testFile: 'Menubar.test.tsx',
      lang: 'tsx',
      usageCode: `import { Menubar, type MenubarItem } from './Menubar';
import '@patterns/menubar/menubar.css';

const menuItems: MenubarItem[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      { type: 'item', id: 'open', label: 'Open' },
      { type: 'separator', id: 'sep1' },
      { type: 'item', id: 'save', label: 'Save' },
      { type: 'item', id: 'export', label: 'Export', disabled: true },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { type: 'item', id: 'cut', label: 'Cut' },
      { type: 'item', id: 'copy', label: 'Copy' },
      { type: 'item', id: 'paste', label: 'Paste' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { type: 'checkbox', id: 'toolbar', label: 'Show Toolbar', checked: true },
      { type: 'separator', id: 'sep2' },
      {
        type: 'radiogroup',
        id: 'theme',
        label: 'Theme',
        items: [
          { type: 'radio', id: 'light', label: 'Light', checked: true },
          { type: 'radio', id: 'dark', label: 'Dark', checked: false },
        ],
      },
    ],
  },
];

<Menubar
  items={menuItems}
  aria-label="Application"
  onItemSelect={(id) => console.log('Selected:', id)}
/>`,
      apiProps: [
        {
          name: 'items',
          type: 'MenubarItem[]',
          default: 'required',
          description: {
            en: 'Array of top-level menu items',
            ja: 'トップレベルのメニュー項目の配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible name (required if no aria-labelledby)',
            ja: 'アクセシブルな名前（aria-labelledbyがない場合は必須）',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labelling element (required if no aria-label)',
            ja: 'ラベリング要素のID（aria-labelがない場合は必須）',
          },
        },
        {
          name: 'onItemSelect',
          type: '(id: string) => void',
          default: '-',
          description: {
            en: 'Callback when an item is activated',
            ja: '項目がアクティブ化されたときのコールバック',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class for the container',
            ja: '追加のCSSクラス',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Menubar.vue',
      testFile: 'Menubar.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import Menubar, { type MenubarItem } from './Menubar.vue';
import '@patterns/menubar/menubar.css';

const menuItems: MenubarItem[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      { type: 'item', id: 'save', label: 'Save' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { type: 'item', id: 'cut', label: 'Cut' },
      { type: 'item', id: 'copy', label: 'Copy' },
    ],
  },
];

function handleItemSelect(id: string) {
  console.log('Selected:', id);
}
</script>

<template>
  <Menubar
    :items="menuItems"
    aria-label="Application"
    @item-select="handleItemSelect"
  />
</template>`,
      apiProps: [
        {
          name: 'items',
          type: 'MenubarItem[]',
          default: 'required',
          description: {
            en: 'Array of top-level menu items',
            ja: 'トップレベルのメニュー項目の配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible name (required if no aria-labelledby)',
            ja: 'アクセシブルな名前（aria-labelledbyがない場合は必須）',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labelling element',
            ja: 'ラベリング要素のID',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'item-select',
          detail: 'string (itemId)',
          description: {
            en: 'Emitted when an item is activated',
            ja: '項目がアクティブ化されたときに発行',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Menubar.svelte',
      testFile: 'Menubar.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import Menubar, { type MenubarItem } from './Menubar.svelte';
  import '@patterns/menubar/menubar.css';

  const menuItems: MenubarItem[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        { type: 'item', id: 'new', label: 'New' },
        { type: 'item', id: 'save', label: 'Save' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { type: 'item', id: 'cut', label: 'Cut' },
        { type: 'item', id: 'copy', label: 'Copy' },
      ],
    },
  ];

  function handleItemSelect(id: string) {
    console.log('Selected:', id);
  }
</script>

<Menubar
  items={menuItems}
  aria-label="Application"
  onItemSelect={handleItemSelect}
/>`,
      apiProps: [
        {
          name: 'items',
          type: 'MenubarItem[]',
          default: 'required',
          description: {
            en: 'Array of top-level menu items',
            ja: 'トップレベルのメニュー項目の配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible name (required if no aria-labelledby)',
            ja: 'アクセシブルな名前（aria-labelledbyがない場合は必須）',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labelling element',
            ja: 'ラベリング要素のID',
          },
        },
        {
          name: 'onItemSelect',
          type: '(id: string) => void',
          default: '-',
          description: {
            en: 'Callback when an item is activated',
            ja: '項目がアクティブ化されたときのコールバック',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Menubar.astro',
      testFile: 'Menubar.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Menubar, { type MenubarItem } from '@patterns/menubar/Menubar.astro';
import '@patterns/menubar/menubar.css';

const menuItems: MenubarItem[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      { type: 'item', id: 'save', label: 'Save' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { type: 'item', id: 'cut', label: 'Cut' },
      { type: 'item', id: 'copy', label: 'Copy' },
    ],
  },
];
---

<Menubar items={menuItems} aria-label="Application" />`,
      apiProps: [
        {
          name: 'items',
          type: 'MenubarItem[]',
          default: 'required',
          description: {
            en: 'Array of top-level menu items',
            ja: 'トップレベルのメニュー項目の配列',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible name (required if no aria-labelledby)',
            ja: 'アクセシブルな名前（aria-labelledbyがない場合は必須）',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labelling element',
            ja: 'ラベリング要素のID',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
      ],
      apiNote: {
        en: 'The Astro implementation uses Web Components (Custom Elements) for interactivity. The <code>&lt;apg-menubar&gt;</code> custom element handles all keyboard navigation, menu opening/closing, and state management on the client side.',
        ja: 'Astro実装はインタラクティブ性のためにWeb Components（Custom Elements）を使用しています。<code>&lt;apg-menubar&gt;</code>カスタム要素がクライアント側で全てのキーボードナビゲーション、メニューの開閉、状態管理を処理します。',
      },
    },
  },
};

export default menubarMeta;
