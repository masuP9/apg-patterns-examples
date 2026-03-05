import type { PatternMeta } from '@/lib/pattern-meta-types';

const spinbuttonMeta: PatternMeta = {
  title: {
    en: 'Spinbutton',
    ja: 'スピンボタン',
  },
  description: {
    en: 'An input widget that allows users to select a value from a discrete set or range by using increment/decrement buttons, arrow keys, or typing directly.',
    ja: '増減ボタン、矢印キー、または直接入力を使用して、離散的なセットまたは範囲から値を選択できる入力ウィジェット。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
      label: {
        en: 'WAI-ARIA APG: Spinbutton Pattern',
        ja: 'WAI-ARIA APG: Spinbutton パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number',
      label: {
        en: 'MDN: <input type="number"> element',
        ja: 'MDN: <input type="number"> 要素',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Spinbutton.tsx',
      testFile: 'Spinbutton.test.tsx',
      lang: 'tsx',
      usageCode: `import { Spinbutton } from './Spinbutton';

function App() {
  return (
    <div>
      {/* Basic usage with aria-label */}
      <Spinbutton aria-label="Quantity" />

      {/* With visible label and min/max */}
      <Spinbutton
        defaultValue={5}
        min={0}
        max={100}
        label="Quantity"
      />

      {/* With format for display and aria-valuetext */}
      <Spinbutton
        defaultValue={3}
        min={1}
        max={10}
        label="Rating"
        format="{value} of {max}"
      />

      {/* Decimal step values */}
      <Spinbutton
        defaultValue={0.5}
        min={0}
        max={1}
        step={0.1}
        label="Opacity"
      />

      {/* Unbounded (no min/max limits) */}
      <Spinbutton
        defaultValue={0}
        label="Counter"
      />

      {/* With callback */}
      <Spinbutton
        defaultValue={5}
        min={0}
        max={100}
        label="Value"
        onValueChange={(value) => console.log(value)}
      />
    </div>
  );
}`,
      apiProps: [
        {
          name: 'defaultValue',
          type: 'number',
          default: '0',
          description: {
            en: 'Initial value of the spinbutton',
            ja: 'スピンボタンの初期値',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: 'undefined',
          description: {
            en: 'Minimum value (undefined = no limit)',
            ja: '最小値（undefined = 制限なし）',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: 'undefined',
          description: {
            en: 'Maximum value (undefined = no limit)',
            ja: '最大値（undefined = 制限なし）',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: {
            en: 'Step increment for keyboard/button',
            ja: 'キーボード/ボタンの増減単位',
          },
        },
        {
          name: 'largeStep',
          type: 'number',
          default: 'step * 10',
          description: {
            en: 'Large step for PageUp/PageDown',
            ja: 'PageUp/PageDown の大きな増減単位',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the spinbutton is disabled',
            ja: 'スピンボタンを無効化するかどうか',
          },
        },
        {
          name: 'readOnly',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the spinbutton is read-only',
            ja: 'スピンボタンを読み取り専用にするかどうか',
          },
        },
        {
          name: 'showButtons',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to show increment/decrement buttons',
            ja: '増減ボタンを表示するかどうか',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label (also used as aria-labelledby)',
            ja: '表示ラベル（aria-labelledby としても使用）',
          },
        },
        {
          name: 'valueText',
          type: 'string',
          default: '-',
          description: {
            en: 'Human-readable value for aria-valuetext',
            ja: 'aria-valuetext 用の人間が読める値',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for aria-valuetext (e.g., "{value} of {max}")',
            ja: 'aria-valuetext のフォーマットパターン（例："{value} of {max}"）',
          },
        },
        {
          name: 'onValueChange',
          type: '(value: number) => void',
          default: '-',
          description: {
            en: 'Callback when value changes',
            ja: '値が変更されたときのコールバック',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: 'アクセシビリティのため、<code>label</code>、<code>aria-label</code>、または <code>aria-labelledby</code> のいずれかが必須です。',
      },
    },
    vue: {
      sourceFile: 'Spinbutton.vue',
      testFile: 'Spinbutton.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Spinbutton from './Spinbutton.vue';

function handleChange(value) {
  console.log(value);
}
</script>

<template>
  <!-- Basic usage with aria-label -->
  <Spinbutton aria-label="Quantity" />

  <!-- With visible label and min/max -->
  <Spinbutton
    :default-value="5"
    :min="0"
    :max="100"
    label="Quantity"
  />

  <!-- With format for display and aria-valuetext -->
  <Spinbutton
    :default-value="3"
    :min="1"
    :max="10"
    label="Rating"
    format="{value} of {max}"
  />

  <!-- Decimal step values -->
  <Spinbutton
    :default-value="0.5"
    :min="0"
    :max="1"
    :step="0.1"
    label="Opacity"
  />

  <!-- Unbounded (no min/max limits) -->
  <Spinbutton
    :default-value="0"
    label="Counter"
  />

  <!-- With callback -->
  <Spinbutton
    :default-value="5"
    :min="0"
    :max="100"
    label="Value"
    @valuechange="handleChange"
  />
</template>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: 'number',
          default: '0',
          description: {
            en: 'Initial value of the spinbutton',
            ja: 'スピンボタンの初期値',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: 'undefined',
          description: {
            en: 'Minimum value (undefined = no limit)',
            ja: '最小値（undefined = 制限なし）',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: 'undefined',
          description: {
            en: 'Maximum value (undefined = no limit)',
            ja: '最大値（undefined = 制限なし）',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: {
            en: 'Step increment for keyboard/button',
            ja: 'キーボード/ボタンの増減単位',
          },
        },
        {
          name: 'largeStep',
          type: 'number',
          default: 'step * 10',
          description: {
            en: 'Large step for PageUp/PageDown',
            ja: 'PageUp/PageDown の大きな増減単位',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the spinbutton is disabled',
            ja: 'スピンボタンを無効化するかどうか',
          },
        },
        {
          name: 'readOnly',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the spinbutton is read-only',
            ja: 'スピンボタンを読み取り専用にするかどうか',
          },
        },
        {
          name: 'showButtons',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to show increment/decrement buttons',
            ja: '増減ボタンを表示するかどうか',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label (also used as aria-labelledby)',
            ja: '表示ラベル（aria-labelledby としても使用）',
          },
        },
        {
          name: 'valueText',
          type: 'string',
          default: '-',
          description: {
            en: 'Human-readable value for aria-valuetext',
            ja: 'aria-valuetext 用の人間が読める値',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for aria-valuetext (e.g., "{value} of {max}")',
            ja: 'aria-valuetext のフォーマットパターン（例："{value} of {max}"）',
          },
        },
      ],
      apiEvents: [
        {
          name: '@valuechange',
          detail: 'number',
          description: {
            en: 'Emitted when value changes',
            ja: '値が変更されたときに発行される',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: 'アクセシビリティのため、<code>label</code>、<code>aria-label</code>、または <code>aria-labelledby</code> のいずれかが必須です。',
      },
    },
    svelte: {
      sourceFile: 'Spinbutton.svelte',
      testFile: 'Spinbutton.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Spinbutton from './Spinbutton.svelte';

  function handleChange(value) {
    console.log(value);
  }
</script>

<!-- Basic usage with aria-label -->
<Spinbutton aria-label="Quantity" />

<!-- With visible label and min/max -->
<Spinbutton
  defaultValue={5}
  min={0}
  max={100}
  label="Quantity"
/>

<!-- With format for display and aria-valuetext -->
<Spinbutton
  defaultValue={3}
  min={1}
  max={10}
  label="Rating"
  format="{value} of {max}"
/>

<!-- Decimal step values -->
<Spinbutton
  defaultValue={0.5}
  min={0}
  max={1}
  step={0.1}
  label="Opacity"
/>

<!-- Unbounded (no min/max limits) -->
<Spinbutton
  defaultValue={0}
  label="Counter"
/>

<!-- With callback -->
<Spinbutton
  defaultValue={5}
  min={0}
  max={100}
  label="Value"
  onvaluechange={handleChange}
/>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: 'number',
          default: '0',
          description: {
            en: 'Initial value of the spinbutton',
            ja: 'スピンボタンの初期値',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: 'undefined',
          description: {
            en: 'Minimum value (undefined = no limit)',
            ja: '最小値（undefined = 制限なし）',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: 'undefined',
          description: {
            en: 'Maximum value (undefined = no limit)',
            ja: '最大値（undefined = 制限なし）',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: {
            en: 'Step increment for keyboard/button',
            ja: 'キーボード/ボタンの増減単位',
          },
        },
        {
          name: 'largeStep',
          type: 'number',
          default: 'step * 10',
          description: {
            en: 'Large step for PageUp/PageDown',
            ja: 'PageUp/PageDown の大きな増減単位',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the spinbutton is disabled',
            ja: 'スピンボタンを無効化するかどうか',
          },
        },
        {
          name: 'readOnly',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the spinbutton is read-only',
            ja: 'スピンボタンを読み取り専用にするかどうか',
          },
        },
        {
          name: 'showButtons',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to show increment/decrement buttons',
            ja: '増減ボタンを表示するかどうか',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label (also used as aria-labelledby)',
            ja: '表示ラベル（aria-labelledby としても使用）',
          },
        },
        {
          name: 'valueText',
          type: 'string',
          default: '-',
          description: {
            en: 'Human-readable value for aria-valuetext',
            ja: 'aria-valuetext 用の人間が読める値',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for aria-valuetext (e.g., "{value} of {max}")',
            ja: 'aria-valuetext のフォーマットパターン（例："{value} of {max}"）',
          },
        },
        {
          name: 'onvaluechange',
          type: '(value: number) => void',
          default: '-',
          description: {
            en: 'Callback when value changes',
            ja: '値が変更されたときのコールバック',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: 'アクセシビリティのため、<code>label</code>、<code>aria-label</code>、または <code>aria-labelledby</code> のいずれかが必要です。',
      },
    },
    astro: {
      sourceFile: 'Spinbutton.astro',
      testFile: 'Spinbutton.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Spinbutton from './Spinbutton.astro';
---

<!-- Basic usage with aria-label -->
<Spinbutton aria-label="Quantity" />

<!-- With visible label and min/max -->
<Spinbutton
  defaultValue={5}
  min={0}
  max={100}
  label="Quantity"
/>

<!-- With format for display and aria-valuetext -->
<Spinbutton
  defaultValue={3}
  min={1}
  max={10}
  label="Rating"
  format="{value} of {max}"
/>

<!-- Decimal step values -->
<Spinbutton
  defaultValue={0.5}
  min={0}
  max={1}
  step={0.1}
  label="Opacity"
/>

<!-- Unbounded (no min/max limits) -->
<Spinbutton
  defaultValue={0}
  label="Counter"
/>

<!-- Listen to value changes (Web Component event) -->
<Spinbutton id="my-spinbutton" defaultValue={5} label="Value" />

<script>
  const spinbutton = document.querySelector('#my-spinbutton');
  spinbutton?.addEventListener('valuechange', (e) => {
    console.log('Value:', e.detail.value);
  });
</script>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: 'number',
          default: '0',
          description: {
            en: 'Initial value of the spinbutton',
            ja: 'スピンボタンの初期値',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: 'undefined',
          description: {
            en: 'Minimum value (undefined = no limit)',
            ja: '最小値（undefined = 制限なし）',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: 'undefined',
          description: {
            en: 'Maximum value (undefined = no limit)',
            ja: '最大値（undefined = 制限なし）',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: {
            en: 'Step increment for keyboard/button',
            ja: 'キーボード/ボタンのステップ増分',
          },
        },
        {
          name: 'largeStep',
          type: 'number',
          default: 'step * 10',
          description: {
            en: 'Large step for PageUp/PageDown',
            ja: 'PageUp/PageDownの大きなステップ',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the spinbutton is disabled',
            ja: 'スピンボタンが無効かどうか',
          },
        },
        {
          name: 'readOnly',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the spinbutton is read-only',
            ja: 'スピンボタンが読み取り専用かどうか',
          },
        },
        {
          name: 'showButtons',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to show increment/decrement buttons',
            ja: 'インクリメント/デクリメントボタンを表示するかどうか',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label (also used as aria-labelledby)',
            ja: '表示ラベル（aria-labelledbyとしても使用）',
          },
        },
        {
          name: 'valueText',
          type: 'string',
          default: '-',
          description: {
            en: 'Human-readable value for aria-valuetext',
            ja: 'aria-valuetextの人間が読める値',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for aria-valuetext (e.g., "{value} of {max}")',
            ja: 'aria-valuetextのフォーマットパターン（例: "{value} of {max}"）',
          },
        },
      ],
      apiEvents: [
        {
          name: 'valuechange',
          detail: '{value: number}',
          description: {
            en: 'Dispatched when value changes',
            ja: '値が変更されたときに発火',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility. This component uses Web Components for client-side interactivity without requiring hydration.',
        ja: 'アクセシビリティのために、<code>label</code>、<code>aria-label</code>、または<code>aria-labelledby</code>のいずれかが必要です。このコンポーネントは、ハイドレーションを必要とせずにクライアント側のインタラクティビティのためにWeb Componentsを使用しています。',
      },
    },
  },
};

export default spinbuttonMeta;
