import type { PatternMeta } from '@/lib/pattern-meta-types';

const meterMeta: PatternMeta = {
  title: {
    en: 'Meter',
    ja: 'メーター',
  },
  description: {
    en: 'A graphical display of a numeric value within a defined range.',
    ja: '定義された範囲内で変化する数値のグラフィカル表示。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/meter/',
      label: {
        en: 'WAI-ARIA APG: Meter Pattern',
        ja: 'WAI-ARIA APG: Meter パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter',
      label: {
        en: 'MDN: <meter> element',
        ja: 'MDN: <meter> 要素',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Meter.tsx',
      testFile: 'Meter.test.tsx',
      lang: 'tsx',
      usageCode: `import { Meter } from './Meter';

function App() {
  return (
    <div>
      {/* Basic usage with aria-label */}
      <Meter value={75} aria-label="CPU Usage" />

      {/* With visible label */}
      <Meter value={75} label="CPU Usage" />

      {/* With valueText for human-readable value */}
      <Meter
        value={75}
        label="Progress"
        valueText="75%"
      />

      {/* Custom range with valueText */}
      <Meter
        value={3.5}
        min={0}
        max={5}
        label="Rating"
        valueText="3.5 out of 5"
      />

      {/* With format pattern */}
      <Meter
        value={75}
        label="Download Progress"
        format="{value}%"
      />
    </div>
  );
}`,
      apiProps: [
        {
          name: 'value',
          type: 'number',
          default: 'required',
          description: {
            en: 'Current value of the meter',
            ja: 'メーターの現在値',
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
          name: 'clamp',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to clamp value to min/max range',
            ja: '値を min/max の範囲内に制限するかどうか',
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
            en: 'Visible label (also used as aria-label)',
            ja: '表示ラベル（aria-label としても使用される）',
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
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "{value} of {max}")',
            ja: '表示と aria-valuetext のフォーマットパターン（例: "{value}%", "{value} of {max}"）',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: 'アクセシビリティのため、<code>label</code>、<code>aria-label</code>、または <code>aria-labelledby</code> のいずれかが必須です。',
      },
    },
    vue: {
      sourceFile: 'Meter.vue',
      testFile: 'Meter.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Meter from './Meter.vue';
</script>

<template>
  <div>
    <!-- Basic usage with aria-label -->
    <Meter :value="75" aria-label="CPU Usage" />

    <!-- With visible label -->
    <Meter :value="75" label="CPU Usage" />

    <!-- With format pattern -->
    <Meter
      :value="75"
      label="Progress"
      format="{value}%"
    />

    <!-- Custom range -->
    <Meter
      :value="3.5"
      :min="0"
      :max="5"
      label="Rating"
      format="{value} / {max}"
    />

    <!-- With valueText for screen readers -->
    <Meter
      :value="75"
      label="Download Progress"
      valueText="75 percent complete"
    />
  </div>
</template>`,
      apiProps: [
        {
          name: 'value',
          type: 'number',
          default: 'required',
          description: {
            en: 'Current value of the meter',
            ja: 'メーターの現在の値',
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
          name: 'clamp',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to clamp value to min/max range',
            ja: '値を最小値/最大値の範囲にクランプするかどうか',
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
            en: 'Visible label (also used as aria-label)',
            ja: '表示可能なラベル（aria-label としても使用されます）',
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
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "{value} of {max}")',
            ja: '表示と aria-valuetext のフォーマットパターン（例："{value}%"、"{value} of {max}"）',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: 'アクセシビリティのため、<code>label</code>、<code>aria-label</code>、または <code>aria-labelledby</code> のいずれかが必要です。',
      },
    },
    svelte: {
      sourceFile: 'Meter.svelte',
      testFile: 'Meter.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Meter from './Meter.svelte';
</script>

<!-- Basic usage with aria-label -->
<Meter value={75} aria-label="CPU Usage" />

<!-- With visible label -->
<Meter value={75} label="CPU Usage" />

<!-- With format pattern -->
<Meter
  value={75}
  label="Progress"
  format="{value}%"
/>

<!-- Custom range -->
<Meter
  value={3.5}
  min={0}
  max={5}
  label="Rating"
  format="{value} / {max}"
/>

<!-- With valueText for screen readers -->
<Meter
  value={75}
  label="Download Progress"
  valueText="75 percent complete"
/>`,
      apiProps: [
        {
          name: 'value',
          type: 'number',
          default: 'required',
          description: {
            en: 'Current value of the meter',
            ja: 'メーターの現在値',
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
          name: 'clamp',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to clamp value to min/max range',
            ja: '値を min/max の範囲にクランプするかどうか',
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
            en: 'Visible label (also used as aria-label)',
            ja: '表示ラベル（aria-label としても使用される）',
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
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "{value} of {max}")',
            ja: '表示と aria-valuetext のフォーマットパターン（例: "{value}%", "{value} of {max}")',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: 'アクセシビリティのために、<code>label</code>、<code>aria-label</code>、または <code>aria-labelledby</code> のいずれかが必要です。',
      },
    },
    astro: {
      sourceFile: 'Meter.astro',
      testFile: 'Meter.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Meter from './Meter.astro';
---

<!-- Basic usage with aria-label -->
<Meter value={75} aria-label="CPU Usage" />

<!-- With visible label -->
<Meter value={75} label="CPU Usage" />

<!-- With format pattern -->
<Meter
  value={75}
  label="Progress"
  format="{value}%"
/>

<!-- Custom range -->
<Meter
  value={3.5}
  min={0}
  max={5}
  label="Rating"
  format="{value} / {max}"
/>

<!-- With valueText for screen readers -->
<Meter
  value={-10}
  min={-50}
  max={50}
  label="Temperature"
  valueText="-10°C"
/>

<!-- Dynamic updates via Web Component API -->
<Meter value={50} id="my-meter" label="Download" format="{value}%" />
<script>
  const meter = document.querySelector('#my-meter').closest('apg-meter');
  meter.updateValue(75);
</script>`,
      apiProps: [
        {
          name: 'value',
          type: 'number',
          default: 'required',
          description: {
            en: 'Current value of the meter',
            ja: 'メーターの現在値',
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
          name: 'clamp',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to clamp value to min/max range',
            ja: '値を min/max 範囲内にクランプするかどうか',
          },
        },
        {
          name: 'showValue',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Whether to display the value text',
            ja: '値テキストを表示するかどうか',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label (also used as aria-label)',
            ja: '表示ラベル（aria-label としても使用される）',
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
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "{value} of {max}")',
            ja: '表示および aria-valuetext 用のフォーマットパターン（例："{value}%", "{value} of {max}"）',
          },
        },
      ],
      apiEvents: [
        {
          name: 'valuechange',
          detail: '{ value: number }',
          description: {
            en: 'Fired when value is updated via <code>updateValue()</code>',
            ja: '<code>updateValue()</code>によって値が更新されたときに発行される',
          },
        },
      ],
      apiNote: {
        en: 'One of <code>label</code>, <code>aria-label</code>, or <code>aria-labelledby</code> is required for accessibility.',
        ja: 'アクセシビリティのため、<code>label</code>、<code>aria-label</code>、<code>aria-labelledby</code>のいずれかが必須です。',
      },
    },
  },
};

export default meterMeta;
