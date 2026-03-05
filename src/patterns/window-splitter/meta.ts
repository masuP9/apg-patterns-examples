import type { PatternMeta } from '@/lib/pattern-meta-types';

const windowSplitterMeta: PatternMeta = {
  title: {
    en: 'Window Splitter',
    ja: 'Window Splitter',
  },
  description: {
    en: 'A movable separator between two panes that allows users to resize the relative size of each pane. Used in IDEs, file browsers, and resizable layouts.',
    ja: '2つのペイン間で移動可能なセパレーター。ユーザーが各ペインの相対的なサイズを変更できます。IDE、ファイルブラウザ、リサイズ可能なレイアウトで使用されます。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/',
      label: {
        en: 'WAI-ARIA APG: Window Splitter Pattern',
        ja: 'WAI-ARIA APG: Window Splitter パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'WindowSplitter.tsx',
      testFile: 'WindowSplitter.test.tsx',
      lang: 'tsx',
      usageCode: `import { WindowSplitter } from './WindowSplitter';

function App() {
  return (
    <div className="layout">
      <div id="primary-pane" style={{ width: 'var(--splitter-position)' }}>
        Primary Content
      </div>
      <WindowSplitter
        primaryPaneId="primary-pane"
        secondaryPaneId="secondary-pane"
        defaultPosition={50}
        min={20}
        max={80}
        step={5}
        aria-label="Resize panels"
        onPositionChange={(position, sizeInPx) => {
          console.log('Position:', position, 'Size:', sizeInPx);
        }}
      />
      <div id="secondary-pane">
        Secondary Content
      </div>
    </div>
  );
}`,
      apiProps: [
        {
          name: 'primaryPaneId',
          type: 'string',
          default: 'required',
          description: {
            en: 'ID of primary pane (for aria-controls)',
            ja: 'プライマリペインのID（aria-controls用）',
          },
        },
        {
          name: 'secondaryPaneId',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of secondary pane (optional)',
            ja: 'セカンダリペインのID（任意）',
          },
        },
        {
          name: 'defaultPosition',
          type: 'number',
          default: '50',
          description: {
            en: 'Initial position as percentage (0-100)',
            ja: '初期位置（パーセンテージ 0-100）',
          },
        },
        {
          name: 'defaultCollapsed',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Start in collapsed state',
            ja: '折り畳み状態で開始',
          },
        },
        {
          name: 'expandedPosition',
          type: 'number',
          default: '-',
          description: {
            en: 'Position when expanding from initial collapse',
            ja: '初期折り畳みから展開する際の位置',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: '10',
          description: {
            en: 'Minimum position (%)',
            ja: '最小位置（%）',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: '90',
          description: {
            en: 'Maximum position (%)',
            ja: '最大位置（%）',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '5',
          description: {
            en: 'Keyboard step size (%)',
            ja: 'キーボードステップサイズ（%）',
          },
        },
        {
          name: 'largeStep',
          type: 'number',
          default: '10',
          description: {
            en: 'Shift+Arrow step size (%)',
            ja: 'Shift+矢印のステップサイズ（%）',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Splitter orientation',
            ja: 'スプリッターの向き',
          },
        },
        {
          name: 'dir',
          type: "'ltr' | 'rtl'",
          default: '-',
          description: {
            en: 'Text direction for RTL support',
            ja: 'RTLサポート用のテキスト方向',
          },
        },
        {
          name: 'collapsible',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Allow collapse/expand with Enter',
            ja: 'Enterで折り畳み/展開を許可',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disabled state',
            ja: '無効状態',
          },
        },
        {
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Readonly state (focusable but not operable)',
            ja: '読み取り専用状態（フォーカス可能だが操作不可）',
          },
        },
        {
          name: 'onPositionChange',
          type: '(position: number, sizeInPx: number) => void',
          default: '-',
          description: {
            en: 'Callback when position changes',
            ja: '位置変更時のコールバック',
          },
        },
        {
          name: 'onCollapsedChange',
          type: '(collapsed: boolean, previousPosition: number) => void',
          default: '-',
          description: {
            en: 'Callback when collapsed state changes',
            ja: '折り畳み状態変更時のコールバック',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'WindowSplitter.vue',
      testFile: 'WindowSplitter.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import WindowSplitter from './WindowSplitter.vue';

function handlePositionChange(position: number, sizeInPx: number) {
  console.log('Position:', position, 'Size:', sizeInPx);
}
</script>

<template>
  <div class="layout">
    <div id="primary-pane" :style="{ width: 'var(--splitter-position)' }">
      Primary Content
    </div>
    <WindowSplitter
      primary-pane-id="primary-pane"
      secondary-pane-id="secondary-pane"
      :default-position="50"
      :min="20"
      :max="80"
      :step="5"
      aria-label="Resize panels"
      @positionchange="handlePositionChange"
    />
    <div id="secondary-pane">
      Secondary Content
    </div>
  </div>
</template>`,
      apiProps: [
        {
          name: 'primaryPaneId',
          type: 'string',
          default: 'required',
          description: {
            en: 'ID of primary pane',
            ja: 'プライマリペインのID（aria-controls用）',
          },
        },
        {
          name: 'secondaryPaneId',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of secondary pane',
            ja: 'セカンダリペインのID（任意）',
          },
        },
        {
          name: 'defaultPosition',
          type: 'number',
          default: '50',
          description: {
            en: 'Initial position (%)',
            ja: '初期位置（パーセンテージ 0-100）',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Splitter orientation',
            ja: 'スプリッターの向き',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disabled state',
            ja: '無効状態',
          },
        },
        {
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Readonly state',
            ja: '読み取り専用状態',
          },
        },
      ],
      apiEvents: [
        {
          name: '@positionchange',
          detail: '(position: number, sizeInPx: number)',
          description: {
            en: 'Emitted when position changes',
            ja: '位置変更時に発火',
          },
        },
        {
          name: '@collapsedchange',
          detail: '(collapsed: boolean, previousPosition: number)',
          description: {
            en: 'Emitted when collapsed state changes',
            ja: '折り畳み状態変更時に発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'WindowSplitter.svelte',
      testFile: 'WindowSplitter.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import WindowSplitter from './WindowSplitter.svelte';

  function handlePositionChange(position: number, sizeInPx: number) {
    console.log('Position:', position, 'Size:', sizeInPx);
  }
</script>

<div class="layout">
  <div id="primary-pane" style="width: var(--splitter-position)">
    Primary Content
  </div>
  <WindowSplitter
    primaryPaneId="primary-pane"
    secondaryPaneId="secondary-pane"
    defaultPosition={50}
    min={20}
    max={80}
    step={5}
    aria-label="Resize panels"
    onpositionchange={handlePositionChange}
  />
  <div id="secondary-pane">
    Secondary Content
  </div>
</div>`,
      apiProps: [
        {
          name: 'primaryPaneId',
          type: 'string',
          default: 'required',
          description: {
            en: 'ID of primary pane',
            ja: 'プライマリペインのID（aria-controls用）',
          },
        },
        {
          name: 'secondaryPaneId',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of secondary pane',
            ja: 'セカンダリペインのID（任意）',
          },
        },
        {
          name: 'defaultPosition',
          type: 'number',
          default: '50',
          description: {
            en: 'Initial position (%)',
            ja: '初期位置（パーセンテージ 0-100）',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Splitter orientation',
            ja: 'スプリッターの向き',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disabled state',
            ja: '無効状態',
          },
        },
        {
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Readonly state',
            ja: '読み取り専用状態',
          },
        },
      ],
      apiEvents: [
        {
          name: 'onpositionchange',
          detail: '(position: number, sizeInPx: number) => void',
          description: {
            en: 'Called when position changes',
            ja: '位置変更時に呼び出し',
          },
        },
        {
          name: 'oncollapsedchange',
          detail: '(collapsed: boolean, previousPosition: number) => void',
          description: {
            en: 'Called when collapsed state changes',
            ja: '折り畳み状態変更時に呼び出し',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'WindowSplitter.astro',
      testFile: 'WindowSplitter.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import WindowSplitter from './WindowSplitter.astro';
---

<div class="layout">
  <div id="primary-pane">
    Primary Content
  </div>
  <WindowSplitter
    primaryPaneId="primary-pane"
    secondaryPaneId="secondary-pane"
    position={50}
    min={20}
    max={80}
    step={5}
    aria-label="Resize panels"
  />
  <div id="secondary-pane">
    Secondary Content
  </div>
</div>`,
      apiProps: [
        {
          name: 'primaryPaneId',
          type: 'string',
          default: 'required',
          description: {
            en: 'ID of primary pane',
            ja: 'プライマリペインのID（aria-controls用）',
          },
        },
        {
          name: 'secondaryPaneId',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of secondary pane',
            ja: 'セカンダリペインのID（任意）',
          },
        },
        {
          name: 'position',
          type: 'number',
          default: '50',
          description: {
            en: 'Initial position (%)',
            ja: '初期位置（パーセンテージ 0-100）',
          },
        },
        {
          name: 'collapsed',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Start collapsed',
            ja: '折り畳み状態で開始',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Splitter orientation',
            ja: 'スプリッターの向き',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Disabled state',
            ja: '無効状態',
          },
        },
        {
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Readonly state',
            ja: '読み取り専用状態',
          },
        },
      ],
      apiNote: {
        en: 'The Astro component renders an <code>&lt;apg-window-splitter&gt;</code> Web Component. Configuration is passed via <code>data-*</code> attributes and the component handles all keyboard and pointer interaction client-side.',
        ja: 'Astroコンポーネントは <code>&lt;apg-window-splitter&gt;</code> Web Componentをレンダリングします。設定は <code>data-*</code> 属性を通じて渡され、コンポーネントはすべてのキーボードとポインターのインタラクションをクライアントサイドで処理します。',
      },
      apiEvents: [
        {
          name: 'window-splitter:position-change',
          detail: '{ position: number, sizeInPx: number }',
          description: {
            en: 'Fired when position changes',
            ja: '位置変更時に発火',
          },
        },
        {
          name: 'window-splitter:collapsed-change',
          detail: '{ collapsed: boolean, previousPosition: number }',
          description: {
            en: 'Fired when collapsed state changes',
            ja: '折り畳み状態変更時に発火',
          },
        },
      ],
    },
  },
};

export default windowSplitterMeta;
