import type { PatternMeta } from '@/lib/pattern-meta-types';

const sliderMultithumbMeta: PatternMeta = {
  title: {
    en: 'Slider (Multi-Thumb)',
    ja: 'Slider (Multi-Thumb)',
  },
  description: {
    en: 'A slider with two thumbs that allows users to select a range of values within a given range.',
    ja: '指定された範囲内で範囲を選択するための2つのつまみを持つスライダー。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/',
      label: {
        en: 'WAI-ARIA APG: Slider (Multi-Thumb) Pattern',
        ja: 'WAI-ARIA APG: Slider (Multi-Thumb) パターン',
      },
    },
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/',
      label: {
        en: 'WAI-ARIA APG: Slider Pattern',
        ja: 'WAI-ARIA APG: Slider パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'MultiThumbSlider.tsx',
      testFile: 'MultiThumbSlider.test.tsx',
      lang: 'tsx',
      usageCode: `import { MultiThumbSlider } from './MultiThumbSlider';

function App() {
  return (
    <div>
      {/* Basic usage with visible label and aria-label tuple */}
      <MultiThumbSlider
        defaultValue={[20, 80]}
        label="Price Range"
        aria-label={['Minimum Price', 'Maximum Price']}
      />

      {/* With format for display and aria-valuetext */}
      <MultiThumbSlider
        defaultValue={[25, 75]}
        label="Temperature"
        format="{value}\u00B0C"
        aria-label={['Min Temp', 'Max Temp']}
      />

      {/* With minDistance to prevent thumbs from getting too close */}
      <MultiThumbSlider
        defaultValue={[30, 70]}
        minDistance={10}
        label="Budget"
        format="\${value}"
        aria-label={['Min Budget', 'Max Budget']}
      />

      {/* Custom range with step */}
      <MultiThumbSlider
        defaultValue={[200, 800]}
        min={0}
        max={1000}
        step={50}
        label="Price Filter"
        format="\${value}"
        aria-label={['Min Price', 'Max Price']}
      />

      {/* With callbacks */}
      <MultiThumbSlider
        defaultValue={[20, 80]}
        label="Range"
        aria-label={['Lower', 'Upper']}
        onValueChange={(values, activeIndex) => {
          console.log('Changed:', values, 'Active thumb:', activeIndex);
        }}
        onValueCommit={(values) => {
          console.log('Committed:', values);
        }}
      />

      {/* Using aria-labelledby for external labels */}
      <span id="min-label">Minimum</span>
      <span id="max-label">Maximum</span>
      <MultiThumbSlider
        defaultValue={[20, 80]}
        aria-labelledby={['min-label', 'max-label']}
      />
    </div>
  );
}`,
      apiProps: [
        {
          name: 'defaultValue',
          type: '[number, number]',
          default: '[min, max]',
          description: {
            en: 'Initial values for the two thumbs [lower, upper]',
            ja: '2つのつまみの初期値 [下限, 上限]',
          },
        },
        {
          name: 'min',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum value (absolute)',
            ja: '最小値（絶対値）',
          },
        },
        {
          name: 'max',
          type: 'number',
          default: '100',
          description: {
            en: 'Maximum value (absolute)',
            ja: '最大値（絶対値）',
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
          default: 'step \u00D7 10',
          description: {
            en: 'Large step for PageUp/PageDown',
            ja: 'PageUp/PageDownの大きなステップ',
          },
        },
        {
          name: 'minDistance',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum distance between the two thumbs',
            ja: '2つのつまみ間の最小距離',
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
          name: 'showValues',
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
            en: 'Visible label for the slider group',
            ja: 'スライダーグループの可視ラベル',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for display and aria-valuetext (e.g., "{value}%", "${value}")',
            ja: '表示とaria-valuetextのフォーマットパターン（例："{value}%"、"${value}"）',
          },
        },
        {
          name: 'aria-label',
          type: '[string, string]',
          default: '-',
          description: {
            en: 'Accessible labels for each thumb [lower, upper]',
            ja: '各つまみのアクセシブルなラベル [下限, 上限]',
          },
        },
        {
          name: 'aria-labelledby',
          type: '[string, string]',
          default: '-',
          description: {
            en: 'IDs of external label elements [lower, upper]',
            ja: '外部ラベル要素のID [下限, 上限]',
          },
        },
        {
          name: 'getAriaValueText',
          type: '(value, index) => string',
          default: '-',
          description: {
            en: 'Function to generate aria-valuetext dynamically',
            ja: 'aria-valuetextを動的に生成する関数',
          },
        },
        {
          name: 'getAriaLabel',
          type: '(index) => string',
          default: '-',
          description: {
            en: 'Function to generate aria-label dynamically',
            ja: 'aria-labelを動的に生成する関数',
          },
        },
        {
          name: 'onValueChange',
          type: '(values, activeIndex) => void',
          default: '-',
          description: {
            en: 'Callback when any value changes',
            ja: 'いずれかの値が変更されたときのコールバック',
          },
        },
        {
          name: 'onValueCommit',
          type: '(values) => void',
          default: '-',
          description: {
            en: 'Callback when interaction ends (drag ends, key up)',
            ja: '操作が終了したときのコールバック（ドラッグ終了、キーアップ）',
          },
        },
      ],
      apiNote: {
        en: '<strong>Note:</strong> Either <code>aria-label</code>, <code>aria-labelledby</code>, or <code>getAriaLabel</code> is required to provide accessible names for each thumb.',
        ja: '<strong>注意:</strong> 各つまみにアクセシブルな名前を提供するため、<code>aria-label</code>、<code>aria-labelledby</code>、または<code>getAriaLabel</code>のいずれかが必要です。',
      },
    },
    vue: {
      sourceFile: 'MultiThumbSlider.vue',
      lang: 'vue',
      usageCode: `<script setup>
import MultiThumbSlider from './MultiThumbSlider.vue';

function handleValueChange(values, activeIndex) {
  console.log('Changed:', values, 'Active thumb:', activeIndex);
}

function handleValueCommit(values) {
  console.log('Committed:', values);
}
</script>

<template>
  <!-- Basic usage with visible label and ariaLabel tuple -->
  <MultiThumbSlider
    :default-value="[20, 80]"
    label="Price Range"
    :aria-label="['Minimum Price', 'Maximum Price']"
  />

  <!-- With format for display and aria-valuetext -->
  <MultiThumbSlider
    :default-value="[25, 75]"
    label="Temperature"
    format="{value}\u00B0C"
    :aria-label="['Min Temp', 'Max Temp']"
  />

  <!-- With minDistance to prevent thumbs from getting too close -->
  <MultiThumbSlider
    :default-value="[30, 70]"
    :min-distance="10"
    label="Budget"
    format="\${value}"
    :aria-label="['Min Budget', 'Max Budget']"
  />

  <!-- With events -->
  <MultiThumbSlider
    :default-value="[20, 80]"
    label="Range"
    :aria-label="['Lower', 'Upper']"
    @value-change="handleValueChange"
    @value-commit="handleValueCommit"
  />
</template>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: '[number, number]',
          default: '[min, max]',
          description: {
            en: 'Initial values for the two thumbs',
            ja: '2つのつまみの初期値',
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
            en: 'Step increment',
            ja: 'ステップ増分',
          },
        },
        {
          name: 'minDistance',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum distance between thumbs',
            ja: 'つまみ間の最小距離',
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
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label for the slider group',
            ja: 'スライダーグループの可視ラベル',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for display',
            ja: '表示のフォーマットパターン',
          },
        },
        {
          name: 'ariaLabel',
          type: '[string, string]',
          default: '-',
          description: {
            en: 'Accessible labels for each thumb',
            ja: '各つまみのアクセシブルなラベル',
          },
        },
        {
          name: 'ariaLabelledby',
          type: '[string, string]',
          default: '-',
          description: {
            en: 'IDs of external label elements',
            ja: '外部ラベル要素のID',
          },
        },
      ],
      apiEvents: [
        {
          name: 'value-change',
          detail: '(values, activeIndex)',
          description: {
            en: 'Emitted when any value changes',
            ja: 'いずれかの値が変更されたときに発火',
          },
        },
        {
          name: 'value-commit',
          detail: '(values)',
          description: {
            en: 'Emitted when interaction ends',
            ja: '操作が終了したときに発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'MultiThumbSlider.svelte',
      lang: 'svelte',
      usageCode: `<script>
import MultiThumbSlider from './MultiThumbSlider.svelte';

function handleValueChange(values, activeIndex) {
  console.log('Changed:', values, 'Active thumb:', activeIndex);
}

function handleValueCommit(values) {
  console.log('Committed:', values);
}
</script>

<!-- Basic usage with visible label and ariaLabel tuple -->
<MultiThumbSlider
  defaultValue={[20, 80]}
  label="Price Range"
  ariaLabel={['Minimum Price', 'Maximum Price']}
/>

<!-- With format for display and aria-valuetext -->
<MultiThumbSlider
  defaultValue={[25, 75]}
  label="Temperature"
  format="{value}\u00B0C"
  ariaLabel={['Min Temp', 'Max Temp']}
/>

<!-- With minDistance to prevent thumbs from getting too close -->
<MultiThumbSlider
  defaultValue={[30, 70]}
  minDistance={10}
  label="Budget"
  format="\${value}"
  ariaLabel={['Min Budget', 'Max Budget']}
/>

<!-- With callbacks -->
<MultiThumbSlider
  defaultValue={[20, 80]}
  label="Range"
  ariaLabel={['Lower', 'Upper']}
  onvaluechange={handleValueChange}
  onvaluecommit={handleValueCommit}
/>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: '[number, number]',
          default: '[min, max]',
          description: {
            en: 'Initial values for the two thumbs',
            ja: '2つのつまみの初期値',
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
            en: 'Step increment',
            ja: 'ステップ増分',
          },
        },
        {
          name: 'minDistance',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum distance between thumbs',
            ja: 'つまみ間の最小距離',
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
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label for the slider group',
            ja: 'スライダーグループの可視ラベル',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for display',
            ja: '表示のフォーマットパターン',
          },
        },
        {
          name: 'ariaLabel',
          type: '[string, string]',
          default: '-',
          description: {
            en: 'Accessible labels for each thumb',
            ja: '各つまみのアクセシブルなラベル',
          },
        },
        {
          name: 'ariaLabelledby',
          type: '[string, string]',
          default: '-',
          description: {
            en: 'IDs of external label elements',
            ja: '外部ラベル要素のID',
          },
        },
        {
          name: 'onvaluechange',
          type: '(values, activeIndex) => void',
          default: '-',
          description: {
            en: 'Callback when any value changes',
            ja: 'いずれかの値が変更されたときのコールバック',
          },
        },
        {
          name: 'onvaluecommit',
          type: '(values) => void',
          default: '-',
          description: {
            en: 'Callback when interaction ends',
            ja: '操作が終了したときのコールバック',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'MultiThumbSlider.astro',
      lang: 'astro',
      usageCode:
        `---
import MultiThumbSlider from './MultiThumbSlider.astro';
---

<!-- Basic usage with visible label and aria-label props -->
<MultiThumbSlider
  defaultValue={[20, 80]}
  label="Price Range"
  aria-label-lower="Minimum Price"
  aria-label-upper="Maximum Price"
/>

<!-- With format for display and aria-valuetext -->
<MultiThumbSlider
  defaultValue={[25, 75]}
  label="Temperature"
  format="{value}\u00B0C"
  aria-label-lower="Min Temp"
  aria-label-upper="Max Temp"
/>

<!-- With minDistance to prevent thumbs from getting too close -->
<MultiThumbSlider
  defaultValue={[30, 70]}
  minDistance={10}
  label="Budget"
  format="` +
        '${value}' +
        `"
  aria-label-lower="Min Budget"
  aria-label-upper="Max Budget"
/>

<!-- Listening for events with JavaScript -->
<MultiThumbSlider
  id="my-slider"
  defaultValue={[20, 80]}
  label="Range"
  aria-label-lower="Lower"
  aria-label-upper="Upper"
/>

<script>
  const slider = document.getElementById('my-slider');

  slider?.addEventListener('valuechange', (e) => {
    const { values, activeThumbIndex } = e.detail;
    console.log('Changed:', values, 'Active thumb:', activeThumbIndex);
  });

  slider?.addEventListener('valuecommit', (e) => {
    const { values } = e.detail;
    console.log('Committed:', values);
  });
</script>`,
      apiProps: [
        {
          name: 'defaultValue',
          type: '[number, number]',
          default: '[min, max]',
          description: {
            en: 'Initial values for the two thumbs',
            ja: '2つのつまみの初期値',
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
            en: 'Step increment',
            ja: 'ステップ増分',
          },
        },
        {
          name: 'minDistance',
          type: 'number',
          default: '0',
          description: {
            en: 'Minimum distance between thumbs',
            ja: 'つまみ間の最小距離',
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
          name: 'label',
          type: 'string',
          default: '-',
          description: {
            en: 'Visible label for the slider group',
            ja: 'スライダーグループの可視ラベル',
          },
        },
        {
          name: 'format',
          type: 'string',
          default: '-',
          description: {
            en: 'Format pattern for display',
            ja: '表示のフォーマットパターン',
          },
        },
        {
          name: 'aria-label-lower',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for lower thumb',
            ja: '下限つまみのアクセシブルなラベル',
          },
        },
        {
          name: 'aria-label-upper',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for upper thumb',
            ja: '上限つまみのアクセシブルなラベル',
          },
        },
      ],
      apiEvents: [
        {
          name: 'valuechange',
          detail: '{values, activeThumbIndex}',
          description: {
            en: 'Dispatched when any value changes',
            ja: 'いずれかの値が変更されたときに発火',
          },
        },
        {
          name: 'valuecommit',
          detail: '{values}',
          description: {
            en: 'Dispatched when interaction ends',
            ja: '操作が終了したときに発火',
          },
        },
      ],
    },
  },
};

export default sliderMultithumbMeta;
