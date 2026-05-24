import type { PatternMeta } from '@/lib/pattern-meta-types';

const radioGroupMeta: PatternMeta = {
  title: {
    en: 'Radio Group',
    ja: 'Radio Group',
  },
  description: {
    en: 'A set of checkable buttons where only one can be checked at a time.',
    ja: 'ラジオボタンと呼ばれるチェック可能なボタンのセットで、一度に1つだけチェックできます。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
      label: {
        en: 'WAI-ARIA APG: Radio Group Pattern',
        ja: 'WAI-ARIA APG: Radio Group パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio',
      label: {
        en: 'MDN: <input type="radio">',
        ja: 'MDN: <input type="radio">',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'RadioGroup.tsx',
      testFile: 'RadioGroup.test.tsx',
      lang: 'tsx',
      usageCode: `import { RadioGroup } from './RadioGroup';

const options = [
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'green', label: 'Green', value: 'green' },
];

function App() {
  return (
    <RadioGroup
      options={options}
      name="color"
      aria-label="Favorite color"
      defaultValue="blue"
      onValueChange={(value) => console.log('Selected:', value)}
    />
  );
}`,
      apiProps: [
        {
          name: 'options',
          type: 'RadioOption[]',
          default: 'required',
          description: {
            en: 'Array of radio options',
            ja: 'ラジオオプションの配列',
          },
        },
        {
          name: 'name',
          type: 'string',
          default: 'required',
          description: {
            en: 'Group name for form submission',
            ja: 'フォーム送信用のグループ名',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the group',
            ja: 'グループのアクセシブルなラベル',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labeling element',
            ja: 'ラベル要素のID',
          },
        },
        {
          name: 'defaultValue',
          type: 'string',
          default: '""',
          description: {
            en: 'Initially selected value',
            ja: '初期選択値',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'vertical'",
          description: {
            en: 'Layout orientation',
            ja: 'レイアウトの向き',
          },
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          default: '-',
          description: {
            en: 'Callback when selection changes',
            ja: '選択変更時のコールバック',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'RadioGroup.vue',
      lang: 'vue',
      usageCode: `<script setup>
import { RadioGroup } from './RadioGroup.vue';

const options = [
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'green', label: 'Green', value: 'green' },
];

const handleChange = (value) => {
  console.log('Selected:', value);
};
</script>

<template>
  <RadioGroup
    :options="options"
    name="color"
    aria-label="Favorite color"
    default-value="blue"
    @value-change="handleChange"
  />
</template>`,
      apiProps: [
        {
          name: 'options',
          type: 'RadioOption[]',
          default: 'required',
          description: {
            en: 'Array of radio options',
            ja: 'ラジオオプションの配列',
          },
        },
        {
          name: 'name',
          type: 'string',
          default: 'required',
          description: {
            en: 'Group name for form submission',
            ja: 'フォーム送信用のグループ名',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the group',
            ja: 'グループのアクセシブルなラベル',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labeling element',
            ja: 'ラベリング要素の ID',
          },
        },
        {
          name: 'default-value',
          type: 'string',
          default: '""',
          description: {
            en: 'Initially selected value',
            ja: '初期選択値',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'vertical'",
          description: {
            en: 'Layout orientation',
            ja: 'レイアウトの方向',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class',
            ja: '追加の CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'update:modelValue',
          detail: 'string',
          description: {
            en: 'Emitted for v-model binding',
            ja: 'v-model バインディング用に発行されます',
          },
        },
        {
          name: 'valueChange',
          detail: 'string',
          description: {
            en: 'Emitted when selection changes',
            ja: '選択が変更されたときに発行されます',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'RadioGroup.svelte',
      lang: 'svelte',
      usageCode: `<script>
  import RadioGroup from './RadioGroup.svelte';

  const options = [
    { id: 'red', label: 'Red', value: 'red' },
    { id: 'blue', label: 'Blue', value: 'blue' },
    { id: 'green', label: 'Green', value: 'green' },
  ];

  function handleChange(value) {
    console.log('Selected:', value);
  }
</script>

<RadioGroup
  {options}
  name="color"
  aria-label="Favorite color"
  defaultValue="blue"
  onValueChange={handleChange}
/>`,
      apiProps: [
        {
          name: 'options',
          type: 'RadioOption[]',
          default: 'required',
          description: {
            en: 'Array of radio options',
            ja: 'ラジオオプションの配列',
          },
        },
        {
          name: 'name',
          type: 'string',
          default: 'required',
          description: {
            en: 'Group name for form submission',
            ja: 'フォーム送信用のグループ名',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the group',
            ja: 'グループのアクセシブルラベル',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labeling element',
            ja: 'ラベル要素の ID',
          },
        },
        {
          name: 'defaultValue',
          type: 'string',
          default: '""',
          description: {
            en: 'Initially selected value',
            ja: '初期選択値',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'vertical'",
          description: {
            en: 'Layout orientation',
            ja: 'レイアウト方向',
          },
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          default: '-',
          description: {
            en: 'Callback when selection changes',
            ja: '選択変更時のコールバック',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class',
            ja: '追加 CSS クラス',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'RadioGroup.astro',
      lang: 'astro',
      usageCode: `---
import RadioGroup from './RadioGroup.astro';

const options = [
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'green', label: 'Green', value: 'green' },
];
---

<RadioGroup
  options={options}
  name="color"
  aria-label="Favorite color"
  defaultValue="blue"
/>

<script>
  // Listen for value changes
  document.querySelector('apg-radio-group')?.addEventListener('valuechange', (e) => {
    console.log('Selected:', e.detail.value);
  });
</script>`,
      apiProps: [
        {
          name: 'options',
          type: 'RadioOption[]',
          default: 'required',
          description: {
            en: 'Array of radio options',
            ja: 'ラジオオプションの配列',
          },
        },
        {
          name: 'name',
          type: 'string',
          default: 'required',
          description: {
            en: 'Group name for form submission',
            ja: 'フォーム送信用のグループ名',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the group',
            ja: 'グループのアクセシブルラベル',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labeling element',
            ja: 'ラベル要素の ID',
          },
        },
        {
          name: 'defaultValue',
          type: 'string',
          default: '""',
          description: {
            en: 'Initially selected value',
            ja: '初期選択値',
          },
        },
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'vertical'",
          description: {
            en: 'Layout orientation',
            ja: 'レイアウトの方向',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class',
            ja: '追加の CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'valuechange',
          detail: '{ value: string }',
          description: {
            en: 'Dispatched when selection changes',
            ja: '選択が変更されたときに発行される',
          },
        },
      ],
    },
  },
};

export default radioGroupMeta;
