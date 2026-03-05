import type { PatternMeta } from '@/lib/pattern-meta-types';

const sliderMeta: PatternMeta = {
  title: {
    en: 'Slider',
    ja: 'Slider',
  },
  description: {
    en: 'An interactive control that allows users to select a value from within a range.',
    ja: 'ユーザーが範囲内から値を選択できるインタラクティブなコントロール。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/',
      label: {
        en: 'WAI-ARIA APG: Slider Pattern',
        ja: 'WAI-ARIA APG: Slider パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range',
      label: {
        en: 'MDN: <input type="range"> element',
        ja: 'MDN: <input type="range"> 要素',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Slider.tsx',
      testFile: 'Slider.test.tsx',
      lang: 'tsx',
      usageCode: `import { Slider } from './Slider';

function App() {
  return (
    <div>
      {/* Basic usage with aria-label */}
      <Slider defaultValue={50} aria-label="Volume" />

      {/* With visible label */}
      <Slider defaultValue={50} label="Volume" />

      {/* With format for display and aria-valuetext */}
      <Slider
        defaultValue={75}
        label="Progress"
        format="{value}%"
      />

      {/* Custom range with step */}
      <Slider
        defaultValue={3}
        min={1}
        max={5}
        step={1}
        label="Rating"
        format="{value} of {max}"
      />

      {/* Vertical slider */}
      <Slider
        defaultValue={50}
        label="Volume"
        orientation="vertical"
      />

      {/* With callback */}
      <Slider
        defaultValue={50}
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
          default: 'min',
          description: {
            en: 'Initial value of the slider',
            ja: 'スライダーの初期値',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum value',
            ja: '最小値',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: '100',
          description: {
            en: 'Maximum value',
            ja: '最大値',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: {
            en: 'Step increment for keyboard navigation',
            ja: 'キーボードナビゲーションのステップ増分',
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
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Slider orientation',
            ja: 'スライダーの向き',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the slider is disabled',
            ja: 'スライダーが無効化されているかどうか',
          },
        },
        {
          name: 'showValue',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to display the value text',
            ja: '値のテキストを表示するかどうか',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label (also used as aria-labelledby)',
            ja: '表示されるラベル（aria-labelledbyとしても使用）',
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
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "{value} of {max}")',
            ja: '表示とaria-valuetextのフォーマットパターン（例："{value}%"、"{value} of {max}"）',
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
        ja: 'アクセシビリティのため、<code>label</code>、<code>aria-label</code>、または<code>aria-labelledby</code>のいずれかが必要です。',
      },
    },
    vue: {
      sourceFile: 'Slider.vue',
      testFile: 'Slider.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Slider from './Slider.vue';

function handleChange(value) {
  console.log('Value changed:', value);
}
</script>

<template>
  <div>
    <!-- Basic usage with aria-label -->
    <Slider :default-value="50" aria-label="Volume" />

    <!-- With visible label -->
    <Slider :default-value="50" label="Volume" />

    <!-- With format for display and aria-valuetext -->
    <Slider
      :default-value="75"
      label="Progress"
      format="{value}%"
    />

    <!-- Custom range with step -->
    <Slider
      :default-value="3"
      :min="1"
      :max="5"
      :step="1"
      label="Rating"
      format="{value} of {max}"
    />

    <!-- Vertical slider -->
    <Slider
      :default-value="50"
      label="Volume"
      orientation="vertical"
    />

    <!-- With callback -->
    <Slider
      :default-value="50"
      label="Value"
      @value-change="handleChange"
    />
  </div>
</template>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: 'number',
          default: 'min',
          description: {
            en: 'Initial value of the slider',
            ja: 'スライダーの初期値',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum value',
            ja: '最小値',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: '100',
          description: {
            en: 'Maximum value',
            ja: '最大値',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: {
            en: 'Step increment for keyboard navigation',
            ja: 'キーボードナビゲーションのステップ増分',
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
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Slider orientation',
            ja: 'スライダーの向き',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the slider is disabled',
            ja: 'スライダーが無効かどうか',
          },
        },
        {
          name: 'showValue',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to display the value text',
            ja: '値のテキストを表示するかどうか',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label (also used as aria-labelledby)',
            ja: '表示されるラベル（aria-labelledbyとしても使用）',
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
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "{value} of {max}")',
            ja: '表示とaria-valuetextのフォーマットパターン（例: "{value}%", "{value} of {max}"）',
          },
        },
      ],
      apiEvents: [
        {
          name: 'valueChange',
          detail: 'number',
          description: {
            en: 'Emitted when value changes',
            ja: '値が変更されたときに発火',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: '<code>label</code>、<code>aria-label</code>、または <code>aria-labelledby</code> のいずれかがアクセシビリティのために必要です。',
      },
    },
    svelte: {
      sourceFile: 'Slider.svelte',
      testFile: 'Slider.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Slider from './Slider.svelte';

  function handleChange(value) {
    console.log('Value changed:', value);
  }
</script>

<!-- Basic usage with aria-label -->
<Slider defaultValue={50} aria-label="Volume" />

<!-- With visible label -->
<Slider defaultValue={50} label="Volume" />

<!-- With format for display and aria-valuetext -->
<Slider
  defaultValue={75}
  label="Progress"
  format="{value}%"
/>

<!-- Custom range with step -->
<Slider
  defaultValue={3}
  min={1}
  max={5}
  step={1}
  label="Rating"
  format="{value} of {max}"
/>

<!-- Vertical slider -->
<Slider
  defaultValue={50}
  label="Volume"
  orientation="vertical"
/>

<!-- With callback -->
<Slider
  defaultValue={50}
  label="Value"
  onvaluechange={handleChange}
/>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: 'number',
          default: 'min',
          description: {
            en: 'Initial value of the slider',
            ja: 'スライダーの初期値',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum value',
            ja: '最小値',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: '100',
          description: {
            en: 'Maximum value',
            ja: '最大値',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: {
            en: 'Step increment for keyboard navigation',
            ja: 'キーボードナビゲーションのステップ増分',
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
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Slider orientation',
            ja: 'スライダーの方向',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the slider is disabled',
            ja: 'スライダーを無効にするかどうか',
          },
        },
        {
          name: 'showValue',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to display the value text',
            ja: '値のテキストを表示するかどうか',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label (also used as aria-labelledby)',
            ja: '表示されるラベル（aria-labelledbyとしても使用）',
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
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "{value} of {max}")',
            ja: '表示およびaria-valuetextのフォーマットパターン（例: "{value}%", "{value} of {max}"）',
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
        ja: 'アクセシビリティのために、<code>label</code>、<code>aria-label</code>、または <code>aria-labelledby</code> のいずれかが必要です。',
      },
    },
    astro: {
      sourceFile: 'Slider.astro',
      testFile: 'Slider.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Slider from './Slider.astro';
---

<!-- Basic usage with aria-label -->
<Slider defaultValue={50} aria-label="Volume" />

<!-- With visible label -->
<Slider defaultValue={50} label="Volume" />

<!-- With format for display and aria-valuetext -->
<Slider
  defaultValue={75}
  label="Progress"
  format="{value}%"
/>

<!-- Custom range with step -->
<Slider
  defaultValue={3}
  min={1}
  max={5}
  step={1}
  label="Rating"
  format="{value} of {max}"
/>

<!-- Vertical slider -->
<Slider
  defaultValue={50}
  label="Volume"
  orientation="vertical"
/>

<!-- Dynamic updates via Web Component API -->
<Slider defaultValue={50} id="my-slider" label="Volume" />
<script>
  const slider = document.querySelector('#my-slider').closest('apg-slider');
  slider.setValue(75);

  slider.addEventListener('valuechange', (e) => {
    console.log('Value changed:', e.detail.value);
  });
</script>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: 'number',
          default: 'min',
          description: {
            en: 'Initial value of the slider',
            ja: 'スライダーの初期値',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum value',
            ja: '最小値',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: '100',
          description: {
            en: 'Maximum value',
            ja: '最大値',
          },
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: {
            en: 'Step increment for keyboard navigation',
            ja: 'キーボードナビゲーションのステップ増分',
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
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: {
            en: 'Slider orientation',
            ja: 'スライダーの方向',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the slider is disabled',
            ja: 'スライダーが無効かどうか',
          },
        },
        {
          name: 'showValue',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to display the value text',
            ja: '値のテキストを表示するかどうか',
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
            en: 'Human-readable value for aria-valuetext (static)',
            ja: 'aria-valuetextの人間が読める値（静的）',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "{value} of {max}")',
            ja: '表示とaria-valuetextのフォーマットパターン（例: "{value}%"、"{value} of {max}"）',
          },
        },
      ],
      apiEvents: [
        {
          name: 'valuechange',
          detail: '{ value: number }',
          description: {
            en: 'Fired when value changes via keyboard, pointer, or setValue()',
            ja: 'キーボード、ポインター、またはsetValue()による値変更時に発火',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: 'アクセシビリティのために、<code>label</code>、<code>aria-label</code>、または<code>aria-labelledby</code>のいずれかが必要です。',
      },
    },
  },
};

export default sliderMeta;
