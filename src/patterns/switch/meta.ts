import type { PatternMeta } from '@/lib/pattern-meta-types';

const switchMeta: PatternMeta = {
  title: {
    en: 'Switch',
    ja: 'スイッチ',
  },
  description: {
    en: 'A control that allows users to toggle between two states: on and off.',
    ja: 'オンとオフの2つの状態を切り替えることができるコントロール。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',
      label: {
        en: 'WAI-ARIA APG: Switch Pattern',
        ja: 'WAI-ARIA APG: Switch パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Switch.tsx',
      testFile: 'Switch.test.tsx',
      lang: 'tsx',
      usageCode: `import { Switch } from './Switch';

function App() {
  return (
    <Switch
      initialChecked={false}
      onCheckedChange={(checked) => console.log('Checked:', checked)}
    >
      Enable notifications
    </Switch>
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
            en: 'Whether the switch is disabled',
            ja: 'スイッチが無効かどうか',
          },
        },
        {
          name: 'children',
          type: 'ReactNode',
          default: '-',
          description: {
            en: 'Switch label',
            ja: 'スイッチのラベル',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;button&gt;</code> element.',
        ja: 'その他のプロパティはすべて、基になる<code>&lt;button&gt;</code>要素に渡されます。',
      },
    },
    vue: {
      sourceFile: 'Switch.vue',
      testFile: 'Switch.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import Switch from './Switch.vue';

function handleChange(checked) {
  console.log('Checked:', checked);
}
</script>

<template>
  <Switch
    :initial-checked="false"
    @change="handleChange"
  >
    Enable notifications
  </Switch>
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
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the switch is disabled',
            ja: 'スイッチが無効かどうか',
          },
        },
      ],
      apiSlots: [
        {
          name: 'default',
          default: '-',
          description: {
            en: 'Switch label content',
            ja: 'スイッチのラベルコンテンツ',
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
    },
    svelte: {
      sourceFile: 'Switch.svelte',
      testFile: 'Switch.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Switch from './Switch.svelte';

  function handleChange(checked) {
    console.log('Checked:', checked);
  }
</script>

<Switch
  initialChecked={false}
  onCheckedChange={handleChange}
>
  Enable notifications
</Switch>`,
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
            en: 'Whether the switch is disabled',
            ja: 'スイッチを無効にするかどうか',
          },
        },
        {
          name: 'children',
          type: 'Snippet | string',
          default: '-',
          description: {
            en: 'Switch label',
            ja: 'スイッチのラベル',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;button&gt;</code> element.',
        ja: 'その他のすべてのプロパティは、内部の <code>&lt;button&gt;</code> 要素に渡されます。',
      },
    },
    astro: {
      sourceFile: 'Switch.astro',
      lang: 'astro',
      usageCode: `---
import Switch from './Switch.astro';
---

<Switch initialChecked={false}>
  Enable notifications
</Switch>

<script>
  // Listen for change events
  document.querySelector('apg-switch')?.addEventListener('change', (e) => {
    console.log('Checked:', e.detail.checked);
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
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether the switch is disabled',
            ja: 'スイッチが無効かどうか',
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
      apiSlots: [
        {
          name: 'default',
          default: '-',
          description: {
            en: 'Switch label content',
            ja: 'スイッチのラベルコンテンツ',
          },
        },
      ],
      apiEvents: [
        {
          name: 'change',
          detail: '{ checked: boolean }',
          description: {
            en: 'Fired when the switch state changes',
            ja: 'スイッチの状態が変更されたときに発火',
          },
        },
      ],
    },
  },
};

export default switchMeta;
