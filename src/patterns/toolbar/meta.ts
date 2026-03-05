import type { PatternMeta } from '@/lib/pattern-meta-types';

const toolbarMeta: PatternMeta = {
  title: {
    en: 'Toolbar',
    ja: 'Toolbar',
  },
  description: {
    en: 'A container for grouping a set of controls, such as buttons, toggle buttons, or other input elements.',
    ja: 'ボタン、トグルボタン、チェックボックスなどのコントロールセットをグループ化するコンテナ。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
      label: {
        en: 'WAI-ARIA APG: Toolbar Pattern',
        ja: 'WAI-ARIA APG: Toolbar パターン',
      },
    },
    {
      href: 'https://w3c.github.io/aria/#toolbar',
      label: {
        en: 'WAI-ARIA: toolbar role',
        ja: 'WAI-ARIA: toolbar role',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Toolbar.tsx',
      testFile: 'Toolbar.test.tsx',
      lang: 'tsx',
      usageCode: `import {
  Toolbar,
  ToolbarButton,
  ToolbarToggleButton,
  ToolbarSeparator
} from '@patterns/toolbar/Toolbar';

// Basic usage
<Toolbar aria-label="Text formatting">
  <ToolbarToggleButton>Bold</ToolbarToggleButton>
  <ToolbarToggleButton>Italic</ToolbarToggleButton>
  <ToolbarSeparator />
  <ToolbarButton>Copy</ToolbarButton>
  <ToolbarButton>Paste</ToolbarButton>
</Toolbar>

// Vertical toolbar
<Toolbar orientation="vertical" aria-label="Actions">
  <ToolbarButton>New</ToolbarButton>
  <ToolbarButton>Open</ToolbarButton>
  <ToolbarButton>Save</ToolbarButton>
</Toolbar>

// Controlled toggle button
const [isBold, setIsBold] = useState(false);

<Toolbar aria-label="Formatting">
  <ToolbarToggleButton
    pressed={isBold}
    onPressedChange={setIsBold}
  >
    Bold
  </ToolbarToggleButton>
</Toolbar>`,
      apiProps: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Direction of the toolbar',
            ja: 'ツールバーの方向',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the toolbar',
            ja: 'ツールバーのアクセシブルラベル',
          },
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          default: '-',
          description: {
            en: 'Toolbar content',
            ja: 'ツールバーのコンテンツ',
          },
        },
      ],
      apiSubComponents: [
        {
          name: 'ToolbarButton',
          props: [
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
              name: 'onClick',
              type: '() => void',
              default: '-',
              description: {
                en: 'Click handler',
                ja: 'クリックハンドラー',
              },
            },
          ],
        },
        {
          name: 'ToolbarToggleButton',
          props: [
            {
              name: 'pressed',
              type: 'boolean',
              default: '-',
              description: {
                en: 'Controlled pressed state',
                ja: '制御された押下状態',
              },
            },
            {
              name: 'defaultPressed',
              type: 'boolean',
              default: 'false',
              description: {
                en: 'Initial pressed state (uncontrolled)',
                ja: '初期押下状態（非制御）',
              },
            },
            {
              name: 'onPressedChange',
              type: '(pressed: boolean) => void',
              default: '-',
              description: {
                en: 'Callback when pressed state changes',
                ja: '押下状態変更時のコールバック',
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
        },
      ],
    },
    vue: {
      sourceFile: 'Toolbar.vue',
      testFile: 'Toolbar.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Toolbar from '@patterns/toolbar/Toolbar.vue'
import ToolbarButton from '@patterns/toolbar/ToolbarButton.vue'
import ToolbarToggleButton from '@patterns/toolbar/ToolbarToggleButton.vue'
import ToolbarSeparator from '@patterns/toolbar/ToolbarSeparator.vue'
</script>

<template>
  <Toolbar aria-label="Text formatting">
    <ToolbarToggleButton>Bold</ToolbarToggleButton>
    <ToolbarToggleButton>Italic</ToolbarToggleButton>
    <ToolbarSeparator />
    <ToolbarButton>Copy</ToolbarButton>
    <ToolbarButton>Paste</ToolbarButton>
  </Toolbar>
</template>`,
      apiProps: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Direction of the toolbar',
            ja: 'ツールバーの方向',
          },
        },
      ],
      apiEvents: [
        {
          name: 'update:pressed',
          detail: 'boolean',
          description: {
            en: 'Emitted when pressed state changes (v-model)',
            ja: '押下状態が変更されたときに発行されます（v-model）',
          },
        },
        {
          name: 'pressed-change',
          detail: 'boolean',
          description: {
            en: 'Emitted when pressed state changes',
            ja: '押下状態が変更されたときに発行されます',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Toolbar.svelte',
      testFile: 'Toolbar.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Toolbar from '@patterns/toolbar/Toolbar.svelte';
  import ToolbarButton from '@patterns/toolbar/ToolbarButton.svelte';
  import ToolbarToggleButton from '@patterns/toolbar/ToolbarToggleButton.svelte';
  import ToolbarSeparator from '@patterns/toolbar/ToolbarSeparator.svelte';
</script>

<Toolbar aria-label="Text formatting">
  <ToolbarToggleButton>Bold</ToolbarToggleButton>
  <ToolbarToggleButton>Italic</ToolbarToggleButton>
  <ToolbarSeparator />
  <ToolbarButton>Copy</ToolbarButton>
  <ToolbarButton>Paste</ToolbarButton>
</Toolbar>`,
      apiProps: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Direction of the toolbar',
            ja: 'ツールバーの方向',
          },
        },
      ],
      apiSubComponents: [
        {
          name: 'ToolbarToggleButton',
          props: [
            {
              name: 'pressed',
              type: 'boolean',
              default: '-',
              description: {
                en: 'Controlled pressed state',
                ja: '制御された押下状態',
              },
            },
            {
              name: 'defaultPressed',
              type: 'boolean',
              default: 'false',
              description: {
                en: 'Initial pressed state',
                ja: '初期押下状態',
              },
            },
            {
              name: 'onPressedChange',
              type: '(pressed: boolean) => void',
              default: '-',
              description: {
                en: 'Callback when pressed state changes',
                ja: '押下状態変更時のコールバック',
              },
            },
          ],
        },
      ],
    },
    astro: {
      sourceFile: 'Toolbar.astro',
      lang: 'astro',
      usageCode: `---
import Toolbar from '@patterns/toolbar/Toolbar.astro';
import ToolbarButton from '@patterns/toolbar/ToolbarButton.astro';
import ToolbarToggleButton from '@patterns/toolbar/ToolbarToggleButton.astro';
import ToolbarSeparator from '@patterns/toolbar/ToolbarSeparator.astro';
---

<Toolbar aria-label="Text formatting">
  <ToolbarToggleButton>Bold</ToolbarToggleButton>
  <ToolbarToggleButton>Italic</ToolbarToggleButton>
  <ToolbarSeparator />
  <ToolbarButton>Copy</ToolbarButton>
  <ToolbarButton>Paste</ToolbarButton>
</Toolbar>

<script>
  // Listen for toggle button state changes
  document.querySelectorAll('apg-toolbar-toggle-button').forEach(btn => {
    btn.addEventListener('pressed-change', (e) => {
      console.log('Toggle changed:', e.detail.pressed);
    });
  });
</script>`,
      apiProps: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Direction of the toolbar',
            ja: 'ツールバーの方向',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the toolbar',
            ja: 'ツールバーのアクセシブルラベル',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of element that labels the toolbar',
            ja: 'ツールバーをラベル付けする要素の ID',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: {
            en: 'Additional CSS class',
            ja: '追加の CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'pressed-change',
          detail: '{ pressed: boolean }',
          description: {
            en: 'Fired when toggle button state changes',
            ja: 'トグルボタンの状態が変更されたときに発行される',
          },
        },
      ],
      apiNote: {
        en: 'This component uses Web Components (<code>&lt;apg-toolbar&gt;</code>, <code>&lt;apg-toolbar-toggle-button&gt;</code>, <code>&lt;apg-toolbar-separator&gt;</code>) for client-side keyboard navigation and state management.',
        ja: 'このコンポーネントは、クライアント側のキーボードナビゲーションと状態管理のために Web Components（<code>&lt;apg-toolbar&gt;</code>、<code>&lt;apg-toolbar-toggle-button&gt;</code>、<code>&lt;apg-toolbar-separator&gt;</code>）を使用しています。',
      },
    },
  },
};

export default toolbarMeta;
