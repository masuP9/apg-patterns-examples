import type { PatternMeta } from '@/lib/pattern-meta-types';

const alertMeta: PatternMeta = {
  title: {
    en: 'Alert',
    ja: 'Alert',
  },
  description: {
    en: "An element that displays a brief, important message in a way that attracts the user's attention without interrupting the user's task.",
    ja: 'ユーザーのタスクを中断せずに、重要なメッセージを目立つ形で表示する要素。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
      label: {
        en: 'WAI-ARIA APG: Alert Pattern',
        ja: 'WAI-ARIA APG: Alert パターン',
      },
    },
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/',
      label: {
        en: 'WAI-ARIA APG: Alert Dialog Pattern',
        ja: 'WAI-ARIA APG: Alert Dialog パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Alert.tsx',
      testFile: 'Alert.test.tsx',
      lang: 'tsx',
      usageCode: `import { useState } from 'react';
import { Alert } from './Alert';

function App() {
  const [message, setMessage] = useState('');

  return (
    <div>
      {/* IMPORTANT: Alert container is always in DOM */}
      <Alert
        message={message}
        variant="info"
        dismissible
        onDismiss={() => setMessage('')}
      />

      <button onClick={() => setMessage('Operation completed!')}>
        Show Alert
      </button>
    </div>
  );
}`,
      apiProps: [
        {
          name: 'message',
          type: 'string',
          default: '-',
          description: {
            en: 'Alert message content',
            ja: 'アラートメッセージの内容',
          },
        },
        {
          name: 'children',
          type: 'ReactNode',
          default: '-',
          description: {
            en: 'Complex content (alternative to message)',
            ja: '複雑なコンテンツ（messageの代替）',
          },
        },
        {
          name: 'variant',
          type: "'info' | 'success' | 'warning' | 'error'",
          default: "'info'",
          description: {
            en: 'Visual style variant',
            ja: '視覚スタイルのバリアント',
          },
        },
        {
          name: 'dismissible',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Show dismiss button',
            ja: '閉じるボタンを表示',
          },
        },
        {
          name: 'onDismiss',
          type: '() => void',
          default: '-',
          description: {
            en: 'Callback when dismissed',
            ja: '閉じられた時のコールバック',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: 'auto-generated',
          description: {
            en: 'Custom ID for SSR',
            ja: 'SSR用のカスタムID',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS classes',
            ja: '追加のCSSクラス',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Alert.vue',
      lang: 'vue',
      usageCode: `<script setup>
import { ref } from 'vue';
import Alert from './Alert.vue';

const message = ref('');

function showAlert() {
  message.value = 'Operation completed!';
}

function clearAlert() {
  message.value = '';
}
</script>

<template>
  <!-- IMPORTANT: Alert container is always in DOM -->
  <Alert
    :message="message"
    variant="info"
    :dismissible="true"
    @dismiss="clearAlert"
  />

  <button @click="showAlert">
    Show Alert
  </button>
</template>`,
      apiProps: [
        {
          name: 'message',
          type: 'string',
          default: '-',
          description: {
            en: 'Alert message content',
            ja: 'アラートメッセージの内容',
          },
        },
        {
          name: 'variant',
          type: "'info' | 'success' | 'warning' | 'error'",
          default: "'info'",
          description: {
            en: 'Visual style variant',
            ja: '視覚的なスタイルバリアント',
          },
        },
        {
          name: 'dismissible',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Show dismiss button',
            ja: '閉じるボタンを表示',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: 'auto-generated',
          description: {
            en: 'Custom ID',
            ja: 'カスタム ID',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS classes',
            ja: '追加の CSS クラス',
          },
        },
      ],
      apiSlots: [
        {
          name: 'default',
          default: '-',
          description: {
            en: 'Complex content (alternative to message prop)',
            ja: '複雑なコンテンツ（message プロパティの代替）',
          },
        },
      ],
      apiEvents: [
        {
          name: '@dismiss',
          detail: '-',
          description: {
            en: 'Emitted when dismiss button is clicked',
            ja: '閉じるボタンがクリックされたときに発行',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Alert.svelte',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import Alert from './Alert.svelte';

  let message = $state('');

  function showAlert() {
    message = 'Operation completed!';
  }

  function clearAlert() {
    message = '';
  }
</script>

<!-- IMPORTANT: Alert container is always in DOM -->
<Alert
  id="my-alert"
  {message}
  variant="info"
  dismissible
  onDismiss={clearAlert}
/>

<button onclick={showAlert}>
  Show Alert
</button>`,
      apiProps: [
        {
          name: 'id',
          type: 'string',
          default: '-',
          description: {
            en: 'Required ID for SSR consistency',
            ja: 'SSR一貫性のための必須ID',
          },
        },
        {
          name: 'message',
          type: 'string',
          default: '-',
          description: {
            en: 'Alert message content',
            ja: 'アラートメッセージの内容',
          },
        },
        {
          name: 'children',
          type: 'Snippet',
          default: '-',
          description: {
            en: 'Complex content (alternative to message)',
            ja: '複雑なコンテンツ（messageの代替）',
          },
        },
        {
          name: 'variant',
          type: "'info' | 'success' | 'warning' | 'error'",
          default: "'info'",
          description: {
            en: 'Visual style variant',
            ja: '視覚的なスタイルバリアント',
          },
        },
        {
          name: 'dismissible',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Show dismiss button',
            ja: '閉じるボタンを表示',
          },
        },
        {
          name: 'onDismiss',
          type: '() => void',
          default: '-',
          description: {
            en: 'Callback when dismissed',
            ja: '閉じられた時のコールバック',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS classes',
            ja: '追加のCSSクラス',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Alert.astro',
      lang: 'astro',
      usageCode: `---
import Alert from './Alert.astro';
---

<!-- IMPORTANT: Alert container is always in DOM -->
<Alert
  id="my-alert"
  variant="info"
  dismissible
/>

<button onclick="document.querySelector('apg-alert').setMessage('Hello!')">
  Show Alert
</button>

<script>
  // Listen for dismiss events
  document.querySelector('apg-alert')?.addEventListener('dismiss', () => {
    console.log('Alert dismissed');
  });
</script>`,
      apiProps: [
        {
          name: 'message',
          type: 'string',
          default: "''",
          description: {
            en: 'Initial alert message',
            ja: '初期アラートメッセージ',
          },
        },
        {
          name: 'variant',
          type: "'info' | 'success' | 'warning' | 'error'",
          default: "'info'",
          description: {
            en: 'Visual style variant',
            ja: '表示スタイルのバリアント',
          },
        },
        {
          name: 'dismissible',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Show dismiss button',
            ja: '閉じるボタンを表示',
          },
        },
        {
          name: 'id',
          type: 'string',
          default: 'auto-generated',
          description: {
            en: 'Custom ID',
            ja: 'カスタム ID',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS classes',
            ja: '追加の CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'dismiss',
          detail: '-',
          description: {
            en: 'Fired when dismiss button is clicked',
            ja: '閉じるボタンがクリックされたときに発火',
          },
        },
      ],
      apiNote: {
        en: 'This component uses a Web Component (<code>&lt;apg-alert&gt;</code>) for client-side interactivity. Use <code>setMessage(message, variant?)</code> method to update alert message programmatically.',
        ja: 'このコンポーネントは、クライアントサイドのインタラクティビティのためにWeb Component（<code>&lt;apg-alert&gt;</code>）を使用しています。<code>setMessage(message, variant?)</code> メソッドでアラートメッセージをプログラムで更新できます。',
      },
    },
  },
};

export default alertMeta;
