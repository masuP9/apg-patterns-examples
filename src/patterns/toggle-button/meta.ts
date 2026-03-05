import type { PatternMeta } from '@/lib/pattern-meta-types';

const toggleButtonMeta: PatternMeta = {
  title: {
    en: 'Toggle Button',
    ja: 'Toggle Button',
  },
  description: {
    en: 'A two-state button that can be either "pressed" or "not pressed".',
    ja: '「押されている」または「押されていない」の2つの状態を持つボタン。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
      label: {
        en: 'WAI-ARIA APG: Button Pattern',
        ja: 'WAI-ARIA APG: Button パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'ToggleButton.tsx',
      testFile: 'ToggleButton.test.tsx',
      lang: 'tsx',
      usageCode: `import { ToggleButton } from './ToggleButton';
import { Volume2, VolumeOff } from 'lucide-react';

function App() {
  return (
    <ToggleButton
      initialPressed={false}
      onPressedChange={(pressed) => console.log('Muted:', pressed)}
      pressedIndicator={<VolumeOff size={20} />}
      unpressedIndicator={<Volume2 size={20} />}
    >
      Mute
    </ToggleButton>
  );
}`,
      apiProps: [
        {
          name: 'initialPressed',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial pressed state',
            ja: '初期の押下状態',
          },
        },
        {
          name: 'onPressedChange',
          type: '(pressed: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when state changes',
            ja: '状態変更時のコールバック',
          },
        },
        {
          name: 'pressedIndicator',
          type: 'ReactNode',
          default: '"●"',
          description: {
            en: 'Custom indicator for pressed state',
            ja: '押下状態のカスタムインジケーター',
          },
        },
        {
          name: 'unpressedIndicator',
          type: 'ReactNode',
          default: '"○"',
          description: {
            en: 'Custom indicator for unpressed state',
            ja: '非押下状態のカスタムインジケーター',
          },
        },
        {
          name: 'children',
          type: 'ReactNode',
          default: '-',
          description: {
            en: 'Button label',
            ja: 'ボタンのラベル',
          },
        },
      ],
      apiNote: {
        en: 'All other props are passed to the underlying <code>&lt;button&gt;</code> element.',
        ja: 'その他のプロパティは、内部の <code>&lt;button&gt;</code> 要素に渡されます。',
      },
    },
    vue: {
      sourceFile: 'ToggleButton.vue',
      testFile: 'ToggleButton.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup>
import ToggleButton from './ToggleButton.vue';
import { Volume2, VolumeOff } from 'lucide-vue-next';

const handleToggle = (pressed) => {
  console.log('Muted:', pressed);
};
</script>

<template>
  <ToggleButton
    :initial-pressed="false"
    @toggle="handleToggle"
  >
    <template #pressed-indicator>
      <VolumeOff :size="20" />
    </template>
    <template #unpressed-indicator>
      <Volume2 :size="20" />
    </template>
    Mute
  </ToggleButton>
</template>`,
      apiProps: [
        {
          name: 'initialPressed',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial pressed state',
            ja: '初期の押下状態',
          },
        },
        {
          name: 'pressedIndicator',
          type: 'string',
          default: '"●"',
          description: {
            en: 'Custom indicator for pressed state',
            ja: '押下状態のカスタムインジケーター',
          },
        },
        {
          name: 'unpressedIndicator',
          type: 'string',
          default: '"○"',
          description: {
            en: 'Custom indicator for unpressed state',
            ja: '非押下状態のカスタムインジケーター',
          },
        },
      ],
      apiSlots: [
        {
          name: 'default',
          default: '-',
          description: {
            en: 'Button label content',
            ja: 'ボタンのラベルコンテンツ',
          },
        },
        {
          name: 'pressed-indicator',
          default: '"●"',
          description: {
            en: 'Custom indicator for pressed state',
            ja: '押下状態のカスタムインジケーター',
          },
        },
        {
          name: 'unpressed-indicator',
          default: '"○"',
          description: {
            en: 'Custom indicator for unpressed state',
            ja: '非押下状態のカスタムインジケーター',
          },
        },
      ],
      apiEvents: [
        {
          name: 'toggle',
          detail: 'boolean',
          description: {
            en: 'Emitted when state changes',
            ja: '状態が変更されたときに発火',
          },
        },
      ],
      apiNote: {
        en: 'All other attributes are passed to the underlying <code>&lt;button&gt;</code> element via <code>v-bind="$attrs"</code>.',
        ja: 'その他の属性は <code>v-bind="$attrs"</code> を介して、基盤となる <code>&lt;button&gt;</code> 要素に渡されます。',
      },
    },
    svelte: {
      sourceFile: 'ToggleButton.svelte',
      testFile: 'ToggleButton.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import ToggleButton from './ToggleButton.svelte';

  function handleToggle(pressed) {
    console.log('Muted:', pressed);
  }
</script>

<ToggleButton
  initialPressed={false}
  onToggle={handleToggle}
  pressedIndicator="🔇"
  unpressedIndicator="🔊"
>
  Mute
</ToggleButton>`,
      apiProps: [
        {
          name: 'initialPressed',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial pressed state',
            ja: '初期の押下状態',
          },
        },
        {
          name: 'onToggle',
          type: '(pressed: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when state changes',
            ja: '状態変更時のコールバック',
          },
        },
        {
          name: 'pressedIndicator',
          type: 'Snippet | string',
          default: '"●"',
          description: {
            en: 'Custom indicator for pressed state',
            ja: '押下状態のカスタムインジケーター',
          },
        },
        {
          name: 'unpressedIndicator',
          type: 'Snippet | string',
          default: '"○"',
          description: {
            en: 'Custom indicator for unpressed state',
            ja: '非押下状態のカスタムインジケーター',
          },
        },
        {
          name: 'children',
          type: 'Snippet | string',
          default: '-',
          description: {
            en: 'Button label (slot content)',
            ja: 'ボタンのラベル（スロットコンテンツ）',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'ToggleButton.astro',
      lang: 'astro',
      usageCode: `---
import ToggleButton from './ToggleButton.astro';
import Icon from './Icon.astro';
---

<ToggleButton>
  <Icon name="volume-off" slot="pressed-indicator" />
  <Icon name="volume-2" slot="unpressed-indicator" />
  Mute
</ToggleButton>

<script>
  // Listen for toggle events
  document.querySelector('apg-toggle-button')?.addEventListener('toggle', (e) => {
    console.log('Muted:', e.detail.pressed);
  });
</script>`,
      apiProps: [
        {
          name: 'initialPressed',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial pressed state',
            ja: '初期の押下状態',
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
        {
          name: 'class',
          type: 'string',
          default: '""',
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
      ],
      apiSlots: [
        {
          name: 'default',
          default: '-',
          description: {
            en: 'Button label content',
            ja: 'ボタンラベルのコンテンツ',
          },
        },
        {
          name: 'pressed-indicator',
          default: '"●"',
          description: {
            en: 'Custom indicator for pressed state',
            ja: '押下状態のカスタムインジケーター',
          },
        },
        {
          name: 'unpressed-indicator',
          default: '"○"',
          description: {
            en: 'Custom indicator for unpressed state',
            ja: '非押下状態のカスタムインジケーター',
          },
        },
      ],
      apiEvents: [
        {
          name: 'toggle',
          detail: '{ pressed: boolean }',
          description: {
            en: 'Fired when the toggle state changes',
            ja: 'トグル状態が変更されたときに発火',
          },
        },
      ],
      apiNote: {
        en: 'This component uses a Web Component (<code>&lt;apg-toggle-button&gt;</code>) for client-side interactivity.',
        ja: 'このコンポーネントは、クライアントサイドのインタラクティビティのためにWeb Component（<code>&lt;apg-toggle-button&gt;</code>）を使用しています。',
      },
    },
  },
};

export default toggleButtonMeta;
