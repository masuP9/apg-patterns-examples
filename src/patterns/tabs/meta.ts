import type { PatternMeta } from '@/lib/pattern-meta-types';

const tabsMeta: PatternMeta = {
  title: {
    en: 'Tabs',
    ja: 'Tabs',
  },
  description: {
    en: 'A set of layered sections of content, known as tab panels, that display one panel of content at a time.',
    ja: 'タブパネルと呼ばれるコンテンツの層状セクションのセットで、一度に1つのパネルを表示します。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
      label: {
        en: 'WAI-ARIA APG: Tabs Pattern',
        ja: 'WAI-ARIA APG: Tabs パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Tabs.tsx',
      testFile: 'Tabs.test.tsx',
      lang: 'tsx',
      usageCode: `import { Tabs } from './Tabs';

const tabs = [
  { id: 'tab1', label: 'First', content: 'First panel content' },
  { id: 'tab2', label: 'Second', content: 'Second panel content' },
  { id: 'tab3', label: 'Third', content: 'Third panel content' }
];

function App() {
  return (
    <Tabs
      tabs={tabs}
      defaultSelectedId="tab1"
      onSelectionChange={(id) => console.log('Tab changed:', id)}
    />
  );
}`,
      apiProps: [
        {
          name: 'tabs',
          type: 'TabItem[]',
          default: 'required',
          description: {
            en: 'Array of tab items',
            ja: 'タブアイテムの配列',
          },
        },
        {
          name: 'defaultSelectedId',
          type: 'string',
          default: 'first tab',
          description: {
            en: 'ID of the initially selected tab',
            ja: '初期選択されるタブのID',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Tab layout direction',
            ja: 'タブの配置方向',
          },
        },
        {
          name: 'activation',
          type: "'automatic' | 'manual'",
          default: "'automatic'",
          description: {
            en: 'How tabs are activated',
            ja: 'タブのアクティベーション方法',
          },
        },
        {
          name: 'onSelectionChange',
          type: '(tabId: string) => void',
          default: '-',
          description: {
            en: 'Callback when tab changes',
            ja: 'タブが変更されたときのコールバック',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Tabs.vue',
      testFile: 'Tabs.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Tabs from './Tabs.vue';

const tabs = [
  { id: 'tab1', label: 'First', content: 'First panel content' },
  { id: 'tab2', label: 'Second', content: 'Second panel content' },
  { id: 'tab3', label: 'Third', content: 'Third panel content' }
];
</script>

<template>
  <Tabs
    :tabs="tabs"
    label="My tabs"
    @tab-change="(id) => console.log('Tab changed:', id)"
  />
</template>`,
      apiProps: [
        {
          name: 'tabs',
          type: 'TabItem[]',
          default: 'required',
          description: {
            en: 'Array of tab items with id, label, content',
            ja: 'id、label、contentを含むタブアイテムの配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the tablist',
            ja: 'タブリストのアクセシブルなラベル',
          },
        },
        {
          name: 'defaultTab',
          type: 'string',
          default: 'first tab',
          description: {
            en: 'ID of the initially selected tab',
            ja: '初期選択されるタブのID',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Tab layout direction',
            ja: 'タブのレイアウト方向',
          },
        },
        {
          name: 'activationMode',
          type: "'automatic' | 'manual'",
          default: "'automatic'",
          description: {
            en: 'How tabs are activated',
            ja: 'タブのアクティベーション方法',
          },
        },
      ],
      apiEvents: [
        {
          name: 'tab-change',
          detail: 'string',
          description: {
            en: 'Emitted when the active tab changes',
            ja: 'アクティブなタブが変更されたときに発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Tabs.svelte',
      testFile: 'Tabs.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Tabs from './Tabs.svelte';

  const tabs = [
    { id: 'tab1', label: 'First', content: 'First panel content' },
    { id: 'tab2', label: 'Second', content: 'Second panel content' },
    { id: 'tab3', label: 'Third', content: 'Third panel content' }
  ];

  function handleTabChange(event) {
    console.log('Tab changed:', event.detail);
  }
</script>

<Tabs
  {tabs}
  label="My tabs"
  ontabchange={handleTabChange}
/>`,
      apiProps: [
        {
          name: 'tabs',
          type: 'TabItem[]',
          default: 'required',
          description: {
            en: 'Array of tab items with id, label, content',
            ja: 'id、label、content を持つタブアイテムの配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the tablist',
            ja: 'タブリストのアクセシブルラベル',
          },
        },
        {
          name: 'defaultTab',
          type: 'string',
          default: 'first tab',
          description: {
            en: 'ID of the initially selected tab',
            ja: '初期選択されるタブのID',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Tab layout direction',
            ja: 'タブの配置方向',
          },
        },
        {
          name: 'activationMode',
          type: "'automatic' | 'manual'",
          default: "'automatic'",
          description: {
            en: 'How tabs are activated',
            ja: 'タブのアクティベーション方法',
          },
        },
      ],
      apiEvents: [
        {
          name: 'tabchange',
          detail: 'string',
          description: {
            en: 'Dispatched when the active tab changes',
            ja: 'アクティブなタブが変更されたときに発火',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Tabs.astro',
      lang: 'astro',
      usageCode: `---
import Tabs from './Tabs.astro';

const tabs = [
  { id: 'tab1', label: 'First', content: 'First panel content' },
  { id: 'tab2', label: 'Second', content: 'Second panel content' },
  { id: 'tab3', label: 'Third', content: 'Third panel content' }
];
---

<Tabs
  tabs={tabs}
  defaultSelectedId="tab1"
/>

<script>
  // Listen for tab change events
  document.querySelector('apg-tabs')?.addEventListener('tabchange', (e) => {
    console.log('Tab changed:', e.detail.selectedId);
  });
</script>`,
      apiProps: [
        {
          name: 'tabs',
          type: 'TabItem[]',
          default: 'required',
          description: {
            en: 'Array of tab items',
            ja: 'タブアイテムの配列',
          },
        },
        {
          name: 'defaultSelectedId',
          type: 'string',
          default: 'first tab',
          description: {
            en: 'ID of the initially selected tab',
            ja: '初期選択されるタブのID',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Tab layout direction',
            ja: 'タブのレイアウト方向',
          },
        },
        {
          name: 'activation',
          type: "'automatic' | 'manual'",
          default: "'automatic'",
          description: {
            en: 'How tabs are activated',
            ja: 'タブのアクティベーション方法',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '""',
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'tabchange',
          detail: '{ selectedId: string }',
          description: {
            en: 'Fired when the selected tab changes',
            ja: '選択されたタブが変更されたときに発火',
          },
        },
      ],
      apiNote: {
        en: 'This component uses a Web Component (<code>&lt;apg-tabs&gt;</code>) for client-side keyboard navigation and state management.',
        ja: 'このコンポーネントは、クライアントサイドのキーボードナビゲーションと状態管理のためにWeb Component（<code>&lt;apg-tabs&gt;</code>）を使用しています。',
      },
    },
  },
};

export default tabsMeta;
