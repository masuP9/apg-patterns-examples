import type { PatternMeta } from '@/lib/pattern-meta-types';

const accordionItemTypeBlock = `<details class="mt-4"><summary class="cursor-pointer font-medium">AccordionItem Interface</summary><pre class="mt-2 rounded bg-muted p-3 text-sm"><code>interface AccordionItem {
  id: string;
  header: string;
  content: string;
  disabled?: boolean;
  defaultExpanded?: boolean;
}</code></pre></details>`;

const accordionMeta: PatternMeta = {
  title: {
    en: 'Accordion',
    ja: 'Accordion',
  },
  description: {
    en: 'A vertically stacked set of interactive headings that each reveal a section of content.',
    ja: '垂直に積み重ねられたインタラクティブな見出しのセット。各見出しをクリックするとコンテンツセクションが展開されます。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/',
      label: {
        en: 'WAI-ARIA APG: Accordion Pattern',
        ja: 'WAI-ARIA APG: Accordion パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Accordion.tsx',
      testFile: 'Accordion.test.tsx',
      lang: 'tsx',
      usageCode: `import { Accordion } from './Accordion';

const items = [
  {
    id: 'section1',
    header: 'First Section',
    content: 'Content for the first section...',
    defaultExpanded: true,
  },
  {
    id: 'section2',
    header: 'Second Section',
    content: 'Content for the second section...',
  },
];

function App() {
  return (
    <Accordion
      items={items}
      headingLevel={3}
      allowMultiple={false}
      onExpandedChange={(ids) => console.log('Expanded:', ids)}
    />
  );
}`,
      apiProps: [
        {
          name: 'items',
          type: 'AccordionItem[]',
          default: 'required',
          description: {
            en: 'Array of accordion items',
            ja: 'アコーディオンアイテムの配列',
          },
        },
        {
          name: 'allowMultiple',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Allow multiple panels to be expanded',
            ja: '複数のパネルの同時展開を許可',
          },
        },
        {
          name: 'headingLevel',
          type: '2 | 3 | 4 | 5 | 6',
          default: '3',
          description: {
            en: 'Heading level for accessibility',
            ja: 'アクセシビリティ用の見出しレベル',
          },
        },
        {
          name: 'enableArrowKeys',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Enable arrow key navigation',
            ja: '矢印キーナビゲーションを有効化',
          },
        },
        {
          name: 'onExpandedChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Callback when expansion changes',
            ja: '展開状態が変更されたときのコールバック',
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
      ],
      apiNote: {
        en: accordionItemTypeBlock,
        ja: accordionItemTypeBlock,
      },
    },
    vue: {
      sourceFile: 'Accordion.vue',
      testFile: 'Accordion.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Accordion from './Accordion.vue';

const items = [
  {
    id: 'section1',
    header: 'First Section',
    content: 'Content for the first section...',
    defaultExpanded: true,
  },
  {
    id: 'section2',
    header: 'Second Section',
    content: 'Content for the second section...',
  },
];
</script>

<template>
  <Accordion
    :items="items"
    :heading-level="3"
    :allow-multiple="false"
    @expanded-change="(ids) => console.log('Expanded:', ids)"
  />
</template>`,
      apiProps: [
        {
          name: 'items',
          type: 'AccordionItem[]',
          default: 'required',
          description: {
            en: 'Array of accordion items',
            ja: 'Accordion アイテムの配列',
          },
        },
        {
          name: 'allowMultiple',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Allow multiple panels to be expanded',
            ja: '複数のパネルの展開を許可',
          },
        },
        {
          name: 'headingLevel',
          type: '2 | 3 | 4 | 5 | 6',
          default: '3',
          description: {
            en: 'Heading level for accessibility',
            ja: 'アクセシビリティのための見出しレベル',
          },
        },
        {
          name: 'enableArrowKeys',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Enable arrow key navigation',
            ja: '矢印キーナビゲーションを有効化',
          },
        },
      ],
      apiEvents: [
        {
          name: 'expanded-change',
          detail: 'string[]',
          description: {
            en: 'Emitted when the expanded panels change',
            ja: '展開されたパネルが変更されたときに発行',
          },
        },
      ],
      apiNote: {
        en: accordionItemTypeBlock,
        ja: accordionItemTypeBlock,
      },
    },
    svelte: {
      sourceFile: 'Accordion.svelte',
      testFile: 'Accordion.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Accordion from './Accordion.svelte';

  const items = [
    {
      id: 'section1',
      header: 'First Section',
      content: 'Content for the first section...',
      defaultExpanded: true,
    },
    {
      id: 'section2',
      header: 'Second Section',
      content: 'Content for the second section...',
    },
  ];

  function handleExpandedChange(ids) {
    console.log('Expanded:', ids);
  }
</script>

<Accordion
  {items}
  headingLevel={3}
  allowMultiple={false}
  onExpandedChange={handleExpandedChange}
/>`,
      apiProps: [
        {
          name: 'items',
          type: 'AccordionItem[]',
          default: 'required',
          description: {
            en: 'Array of accordion items',
            ja: 'アコーディオンアイテムの配列',
          },
        },
        {
          name: 'allowMultiple',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Allow multiple panels to be expanded',
            ja: '複数のパネルの展開を許可',
          },
        },
        {
          name: 'headingLevel',
          type: '2 | 3 | 4 | 5 | 6',
          default: '3',
          description: {
            en: 'Heading level for accessibility',
            ja: 'アクセシビリティのための見出しレベル',
          },
        },
        {
          name: 'enableArrowKeys',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Enable arrow key navigation',
            ja: '矢印キーナビゲーションを有効化',
          },
        },
        {
          name: 'onExpandedChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Callback when expansion changes',
            ja: '展開状態変更時のコールバック',
          },
        },
      ],
      apiNote: {
        en: accordionItemTypeBlock,
        ja: accordionItemTypeBlock,
      },
    },
    astro: {
      sourceFile: 'Accordion.astro',
      lang: 'astro',
      usageCode: `---
import Accordion from './Accordion.astro';

const items = [
  {
    id: 'section1',
    header: 'First Section',
    content: 'Content for the first section...',
    defaultExpanded: true,
  },
  {
    id: 'section2',
    header: 'Second Section',
    content: 'Content for the second section...',
  },
];
---

<Accordion
  items={items}
  headingLevel={3}
  allowMultiple={false}
/>`,
      apiProps: [
        {
          name: 'items',
          type: 'AccordionItem[]',
          default: 'required',
          description: {
            en: 'Array of accordion items',
            ja: 'アコーディオンアイテムの配列',
          },
        },
        {
          name: 'allowMultiple',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Allow multiple panels to be expanded',
            ja: '複数のパネルの展開を許可',
          },
        },
        {
          name: 'headingLevel',
          type: '2 | 3 | 4 | 5 | 6',
          default: '3',
          description: {
            en: 'Heading level for accessibility',
            ja: 'アクセシビリティのための見出しレベル',
          },
        },
        {
          name: 'enableArrowKeys',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Enable arrow key navigation',
            ja: '矢印キーナビゲーションを有効化',
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
          detail: '{ expandedIds: string[] }',
          description: {
            en: 'Fired when the expanded panels change',
            ja: '展開されたパネルが変更されたときに発火',
          },
        },
      ],
      apiNote: {
        en: accordionItemTypeBlock,
        ja: accordionItemTypeBlock,
      },
    },
  },
};

export default accordionMeta;
