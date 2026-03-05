import type { PatternMeta } from '@/lib/pattern-meta-types';

const checkboxMeta: PatternMeta = {
  title: {
    en: 'Checkbox',
    ja: 'Checkbox',
  },
  description: {
    en: 'A control that allows users to select one or more options from a set.',
    ja: 'セットから1つ以上のオプションを選択できるコントロール。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
      label: {
        en: 'WAI-ARIA APG: Checkbox Pattern',
        ja: 'WAI-ARIA APG: Checkbox パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox',
      label: {
        en: 'MDN: <input type="checkbox">',
        ja: 'MDN: <input type="checkbox">',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Checkbox.tsx',
      testFile: 'Checkbox.test.tsx',
      lang: 'tsx',
      usageCode: `import { Checkbox } from './Checkbox';

function App() {
  return (
    <form>
      {/* With wrapping label */}
      <label className="inline-flex items-center gap-2">
        <Checkbox
          name="terms"
          onCheckedChange={(checked) => console.log('Checked:', checked)}
        />
        I agree to the terms and conditions
      </label>

      {/* With separate label */}
      <label htmlFor="newsletter">Subscribe to newsletter</label>
      <Checkbox id="newsletter" name="newsletter" initialChecked={true} />

      {/* Indeterminate state for "select all" */}
      <label className="inline-flex items-center gap-2">
        <Checkbox indeterminate aria-label="Select all items" />
        Select all items
      </label>
    </form>
  );
}`,
      apiProps: [
        {
          name: 'initialChecked',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial checked state',
            ja: '初期チェック状態',
          },
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the checkbox is in an indeterminate (mixed) state',
            ja: '不確定（mixed）状態かどうか',
          },
        },
        {
          name: 'onCheckedChange',
          type: '(checked: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when state changes',
            ja: '状態変更時のコールバック',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the checkbox is disabled',
            ja: '無効化するかどうか',
          },
        },
        {
          name: 'name',
          type: 'string',
          default: '-',
          description: {
            en: 'Form field name',
            ja: 'フォームフィールド名',
          },
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: {
            en: 'Form field value',
            ja: 'フォームフィールド値',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: '-',
          description: {
            en: 'ID for external label association',
            ja: '外部ラベルとの関連付け用 ID',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;input&gt;</code> element.',
        ja: 'その他すべてのプロパティは、基礎となる <code>&lt;input&gt;</code> 要素に渡されます。',
      },
    },
    vue: {
      sourceFile: 'Checkbox.vue',
      testFile: 'Checkbox.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Checkbox from './Checkbox.vue';

function handleChange(checked) {
  console.log('Checked:', checked);
}
</script>

<template>
  <form>
    <!-- With wrapping label -->
    <label class="inline-flex items-center gap-2">
      <Checkbox name="terms" @change="handleChange" />
      I agree to the terms and conditions
    </label>

    <!-- With separate label -->
    <label for="newsletter">Subscribe to newsletter</label>
    <Checkbox id="newsletter" name="newsletter" :initial-checked="true" />

    <!-- Indeterminate state for "select all" -->
    <label class="inline-flex items-center gap-2">
      <Checkbox indeterminate aria-label="Select all items" />
      Select all items
    </label>
  </form>
</template>`,
      apiProps: [
        {
          name: 'initialChecked',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial checked state',
            ja: '初期のチェック状態',
          },
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the checkbox is in an indeterminate (mixed) state',
            ja: 'チェックボックスが不確定（混合）状態かどうか',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the checkbox is disabled',
            ja: 'チェックボックスが無効かどうか',
          },
        },
        {
          name: 'name',
          type: 'string',
          default: '-',
          description: {
            en: 'Form field name',
            ja: 'フォームフィールド名',
          },
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: {
            en: 'Form field value',
            ja: 'フォームフィールド値',
          },
        },
      ],
      apiEvents: [
        {
          name: '@change',
          detail: 'boolean',
          description: {
            en: 'Emitted when state changes',
            ja: '状態が変更されたときに発火',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;input&gt;</code> element.',
        ja: 'その他のプロパティは、基盤となる <code>&lt;input&gt;</code> 要素に渡されます。',
      },
    },
    svelte: {
      sourceFile: 'Checkbox.svelte',
      testFile: 'Checkbox.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Checkbox from './Checkbox.svelte';

  function handleChange(checked) {
    console.log('Checked:', checked);
  }
</script>

<form>
  <!-- With wrapping label -->
  <label class="inline-flex items-center gap-2">
    <Checkbox name="terms" onCheckedChange={handleChange} />
    I agree to the terms and conditions
  </label>

  <!-- With separate label -->
  <label for="newsletter">Subscribe to newsletter</label>
  <Checkbox id="newsletter" name="newsletter" initialChecked={true} />

  <!-- Indeterminate state for "select all" -->
  <label class="inline-flex items-center gap-2">
    <Checkbox indeterminate aria-label="Select all items" />
    Select all items
  </label>
</form>`,
      apiProps: [
        {
          name: 'initialChecked',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial checked state',
            ja: '初期のチェック状態',
          },
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the checkbox is in an indeterminate (mixed) state',
            ja: 'チェックボックスが不確定（混合）状態かどうか',
          },
        },
        {
          name: 'onCheckedChange',
          type: '(checked: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when state changes',
            ja: '状態が変更されたときのコールバック',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the checkbox is disabled',
            ja: 'チェックボックスを無効にするかどうか',
          },
        },
        {
          name: 'name',
          type: 'string',
          default: '-',
          description: {
            en: 'Form field name',
            ja: 'フォームフィールド名',
          },
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: {
            en: 'Form field value',
            ja: 'フォームフィールド値',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;input&gt;</code> element.',
        ja: 'その他のすべてのプロパティは、内部の <code>&lt;input&gt;</code> 要素に渡されます。',
      },
    },
    astro: {
      sourceFile: 'Checkbox.astro',
      testFile: 'Checkbox.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Checkbox from './Checkbox.astro';
---

<form>
  <!-- With wrapping label -->
  <label class="inline-flex items-center gap-2">
    <Checkbox name="terms" />
    I agree to the terms and conditions
  </label>

  <!-- With separate label -->
  <label for="newsletter">Subscribe to newsletter</label>
  <Checkbox id="newsletter" name="newsletter" initialChecked={true} />

  <!-- Indeterminate state for "select all" -->
  <label class="inline-flex items-center gap-2">
    <Checkbox indeterminate />
    Select all items
  </label>
</form>

<script>
  // Listen for change events
  document.querySelectorAll('apg-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('checkedchange', (e) => {
      console.log('Checked:', e.detail.checked);
    });
  });
</script>`,
      apiProps: [
        {
          name: 'initialChecked',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial checked state',
            ja: '初期のチェック状態',
          },
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the checkbox is in an indeterminate (mixed) state',
            ja: 'チェックボックスが不確定（混在）状態かどうか',
          },
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the checkbox is disabled',
            ja: 'チェックボックスが無効かどうか',
          },
        },
        {
          name: 'name',
          type: 'string',
          default: '-',
          description: {
            en: 'Form field name',
            ja: 'フォームフィールド名',
          },
        },
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: {
            en: 'Form field value',
            ja: 'フォームフィールド値',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: '-',
          description: {
            en: 'ID for external label association',
            ja: '外部ラベルとの関連付け用ID',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '""',
          description: {
            en: 'Additional CSS classes',
            ja: '追加のCSSクラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'checkedchange',
          detail: '{ checked: boolean }',
          description: {
            en: 'Fired when the checkbox state changes',
            ja: 'チェックボックスの状態が変更されたときに発火',
          },
        },
      ],
    },
  },
};

export default checkboxMeta;
