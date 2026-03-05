import type { PatternMeta } from '@/lib/pattern-meta-types';

const comboboxMeta: PatternMeta = {
  title: {
    en: 'Combobox',
    ja: 'コンボボックス',
  },
  description: {
    en: 'An editable combobox with list autocomplete. Users can type to filter options or select from a popup listbox using keyboard or mouse.',
    ja: 'リストオートコンプリート機能を持つ編集可能なコンボボックス。ユーザーは入力してオプションをフィルタリングしたり、キーボードやマウスでポップアップリストボックスから選択したりできます。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
      label: {
        en: 'WAI-ARIA APG: Combobox Pattern',
        ja: 'WAI-ARIA APG: Combobox パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist',
      label: {
        en: 'MDN: <datalist> element',
        ja: 'MDN: <datalist> 要素',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Combobox.tsx',
      testFile: 'Combobox.test.tsx',
      lang: 'tsx',
      usageCode: `import { Combobox } from './Combobox';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
];

function App() {
  return (
    <div>
      {/* Basic usage */}
      <Combobox
        options={options}
        label="Favorite Fruit"
        placeholder="Type to search..."
      />

      {/* With default value */}
      <Combobox
        options={options}
        label="Fruit"
        defaultSelectedOptionId="banana"
      />

      {/* With disabled options */}
      <Combobox
        options={[
          { id: 'a', label: 'Option A' },
          { id: 'b', label: 'Option B', disabled: true },
          { id: 'c', label: 'Option C' },
        ]}
        label="Select Option"
      />

      {/* No filtering (autocomplete="none") */}
      <Combobox
        options={options}
        label="Select"
        autocomplete="none"
      />

      {/* With callbacks */}
      <Combobox
        options={options}
        label="Fruit"
        onSelect={(option) => console.log('Selected:', option)}
        onInputChange={(value) => console.log('Input:', value)}
        onOpenChange={(isOpen) => console.log('Open:', isOpen)}
      />
    </div>
  );
}`,
      apiProps: [
        {
          name: 'options',
          type: 'ComboboxOption[]',
          default: 'Required',
          description: {
            en: 'Array of options with id, label, and optional disabled',
            ja: 'id、label、オプションの disabled を持つオプションの配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: 'Required',
          description: {
            en: 'Visible label text',
            ja: '表示されるラベルテキスト',
          },
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '-',
          description: {
            en: 'Placeholder text for input',
            ja: '入力のプレースホルダーテキスト',
          },
        },
        {
          name: 'defaultInputValue',
          type: 'string',
          default: '""',
          description: {
            en: 'Default input value',
            ja: 'デフォルトの入力値',
          },
        },
        {
          name: 'defaultSelectedOptionId',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of initially selected option',
            ja: '初期選択されるオプションの ID',
          },
        },
        {
          name: 'inputValue',
          type: 'string',
          default: '-',
          description: {
            en: 'Controlled input value',
            ja: '制御された入力値',
          },
        },
        {
          name: 'selectedOptionId',
          type: 'string',
          default: '-',
          description: {
            en: 'Controlled selected option ID',
            ja: '制御された選択オプション ID',
          },
        },
        {
          name: 'autocomplete',
          type: '"none" | "list" | "both"',
          default: '"list"',
          description: {
            en: 'Autocomplete behavior',
            ja: 'オートコンプリートの動作',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the combobox is disabled',
            ja: 'コンボボックスを無効にするかどうか',
          },
        },
        {
          name: 'onSelect',
          type: '(option: ComboboxOption) => void',
          default: '-',
          description: {
            en: 'Callback when an option is selected',
            ja: 'オプション選択時のコールバック',
          },
        },
        {
          name: 'onInputChange',
          type: '(value: string) => void',
          default: '-',
          description: {
            en: 'Callback when input value changes',
            ja: '入力値変更時のコールバック',
          },
        },
        {
          name: 'onOpenChange',
          type: '(isOpen: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when popup opens/closes',
            ja: 'ポップアップ開閉時のコールバック',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Combobox.vue',
      testFile: 'Combobox.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Combobox from './Combobox.vue';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
];

function handleSelect(option) {
  console.log('Selected:', option);
}

function handleInputChange(value) {
  console.log('Input:', value);
}

function handleOpenChange(isOpen) {
  console.log('Open:', isOpen);
}
</script>

<template>
  <!-- Basic usage -->
  <Combobox
    :options="options"
    label="Favorite Fruit"
    placeholder="Type to search..."
  />

  <!-- With default value -->
  <Combobox
    :options="options"
    label="Fruit"
    default-selected-option-id="banana"
  />

  <!-- With disabled options -->
  <Combobox
    :options="[
      { id: 'a', label: 'Option A' },
      { id: 'b', label: 'Option B', disabled: true },
      { id: 'c', label: 'Option C' },
    ]"
    label="Select Option"
  />

  <!-- No filtering (autocomplete="none") -->
  <Combobox
    :options="options"
    label="Select"
    autocomplete="none"
  />

  <!-- With callbacks -->
  <Combobox
    :options="options"
    label="Fruit"
    @select="handleSelect"
    @inputchange="handleInputChange"
    @openchange="handleOpenChange"
  />
</template>`,
      apiProps: [
        {
          name: 'options',
          type: 'ComboboxOption[]',
          default: 'Required',
          description: {
            en: 'Array of options with id, label, and optional disabled',
            ja: 'id、label、オプションの disabled を持つオプションの配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: 'Required',
          description: {
            en: 'Visible label text',
            ja: '表示されるラベルテキスト',
          },
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '-',
          description: {
            en: 'Placeholder text for input',
            ja: '入力のプレースホルダーテキスト',
          },
        },
        {
          name: 'defaultInputValue',
          type: 'string',
          default: '""',
          description: {
            en: 'Default input value',
            ja: 'デフォルトの入力値',
          },
        },
        {
          name: 'defaultSelectedOptionId',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of initially selected option',
            ja: '初期選択されるオプションの ID',
          },
        },
        {
          name: 'autocomplete',
          type: '"none" | "list" | "both"',
          default: '"list"',
          description: {
            en: 'Autocomplete behavior',
            ja: 'オートコンプリートの動作',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the combobox is disabled',
            ja: 'コンボボックスを無効にするかどうか',
          },
        },
      ],
      apiEvents: [
        {
          name: '@select',
          detail: 'ComboboxOption',
          description: {
            en: 'Emitted when an option is selected',
            ja: 'オプション選択時に発火',
          },
        },
        {
          name: '@inputchange',
          detail: 'string',
          description: {
            en: 'Emitted when input value changes',
            ja: '入力値変更時に発火',
          },
        },
        {
          name: '@openchange',
          detail: 'boolean',
          description: {
            en: 'Emitted when popup opens/closes',
            ja: 'ポップアップ開閉時に発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Combobox.svelte',
      testFile: 'Combobox.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Combobox from './Combobox.svelte';

  const options = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
  ];

  function handleSelect(option) {
    console.log('Selected:', option);
  }

  function handleInputChange(value) {
    console.log('Input:', value);
  }

  function handleOpenChange(isOpen) {
    console.log('Open:', isOpen);
  }
</script>

<!-- Basic usage -->
<Combobox
  {options}
  label="Favorite Fruit"
  placeholder="Type to search..."
/>

<!-- With default value -->
<Combobox
  {options}
  label="Fruit"
  defaultSelectedOptionId="banana"
/>

<!-- With disabled options -->
<Combobox
  options={[
    { id: 'a', label: 'Option A' },
    { id: 'b', label: 'Option B', disabled: true },
    { id: 'c', label: 'Option C' },
  ]}
  label="Select Option"
/>

<!-- No filtering (autocomplete="none") -->
<Combobox
  {options}
  label="Select"
  autocomplete="none"
/>

<!-- With callbacks -->
<Combobox
  {options}
  label="Fruit"
  onselect={handleSelect}
  oninputchange={handleInputChange}
  onopenchange={handleOpenChange}
/>`,
      apiProps: [
        {
          name: 'options',
          type: 'ComboboxOption[]',
          default: 'Required',
          description: {
            en: 'Array of options with id, label, and optional disabled',
            ja: 'id、label、オプションの disabled を持つオプションの配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: 'Required',
          description: {
            en: 'Visible label text',
            ja: '表示されるラベルテキスト',
          },
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '-',
          description: {
            en: 'Placeholder text for input',
            ja: '入力のプレースホルダーテキスト',
          },
        },
        {
          name: 'defaultInputValue',
          type: 'string',
          default: '""',
          description: {
            en: 'Default input value',
            ja: 'デフォルトの入力値',
          },
        },
        {
          name: 'defaultSelectedOptionId',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of initially selected option',
            ja: '初期選択されるオプションの ID',
          },
        },
        {
          name: 'autocomplete',
          type: '"none" | "list" | "both"',
          default: '"list"',
          description: {
            en: 'Autocomplete behavior',
            ja: 'オートコンプリートの動作',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the combobox is disabled',
            ja: 'コンボボックスを無効にするかどうか',
          },
        },
        {
          name: 'onselect',
          type: '(option: ComboboxOption) => void',
          default: '-',
          description: {
            en: 'Callback when an option is selected',
            ja: 'オプション選択時のコールバック',
          },
        },
        {
          name: 'oninputchange',
          type: '(value: string) => void',
          default: '-',
          description: {
            en: 'Callback when input value changes',
            ja: '入力値変更時のコールバック',
          },
        },
        {
          name: 'onopenchange',
          type: '(isOpen: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when popup opens/closes',
            ja: 'ポップアップ開閉時のコールバック',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Combobox.astro',
      lang: 'astro',
      usageCode: `---
import Combobox from './Combobox.astro';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
];
---

<!-- Basic usage -->
<Combobox
  options={options}
  label="Favorite Fruit"
  placeholder="Type to search..."
/>

<!-- With default value -->
<Combobox
  options={options}
  label="Fruit"
  defaultSelectedOptionId="banana"
/>

<!-- With disabled options -->
<Combobox
  options={[
    { id: 'a', label: 'Option A' },
    { id: 'b', label: 'Option B', disabled: true },
    { id: 'c', label: 'Option C' },
  ]}
  label="Select Option"
/>

<!-- No filtering (autocomplete="none") -->
<Combobox
  options={options}
  label="Select"
  autocomplete="none"
/>

<!-- Listen to selection events (Web Component event) -->
<Combobox id="my-combobox" options={options} label="Fruit" />

<script>
  const combobox = document.querySelector('#my-combobox');
  combobox?.addEventListener('select', (e) => {
    console.log('Selected:', e.detail);
  });
  combobox?.addEventListener('inputchange', (e) => {
    console.log('Input:', e.detail.value);
  });
</script>`,
      apiProps: [
        {
          name: 'options',
          type: 'ComboboxOption[]',
          default: 'Required',
          description: {
            en: 'Array of options with id, label, and optional disabled',
            ja: 'id、label、オプションの disabled を持つオプションの配列',
          },
        },
        {
          name: 'label',
          type: 'string',
          default: 'Required',
          description: {
            en: 'Visible label text',
            ja: '表示されるラベルテキスト',
          },
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '-',
          description: {
            en: 'Placeholder text for input',
            ja: '入力のプレースホルダーテキスト',
          },
        },
        {
          name: 'defaultInputValue',
          type: 'string',
          default: '""',
          description: {
            en: 'Default input value',
            ja: 'デフォルトの入力値',
          },
        },
        {
          name: 'defaultSelectedOptionId',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of initially selected option',
            ja: '初期選択されるオプションの ID',
          },
        },
        {
          name: 'autocomplete',
          type: '"none" | "list" | "both"',
          default: '"list"',
          description: {
            en: 'Autocomplete behavior',
            ja: 'オートコンプリートの動作',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the combobox is disabled',
            ja: 'コンボボックスを無効にするかどうか',
          },
        },
      ],
      apiEvents: [
        {
          name: 'select',
          detail: '{id: string, label: string}',
          description: {
            en: 'Dispatched when an option is selected',
            ja: 'オプション選択時に発火',
          },
        },
        {
          name: 'inputchange',
          detail: '{value: string}',
          description: {
            en: 'Dispatched when input value changes',
            ja: '入力値変更時に発火',
          },
        },
      ],
      apiNote: {
        en: 'This component uses Web Components for client-side interactivity without requiring hydration.',
        ja: 'このコンポーネントは、ハイドレーションを必要とせずにクライアントサイドのインタラクティビティのためにWeb Componentsを使用しています。',
      },
    },
  },
};

export default comboboxMeta;
