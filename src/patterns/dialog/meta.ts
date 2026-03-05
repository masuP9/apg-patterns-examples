import type { PatternMeta } from '@/lib/pattern-meta-types';

const dialogMeta: PatternMeta = {
  title: {
    en: 'Dialog (Modal)',
    ja: 'Dialog (Modal)',
  },
  description: {
    en: 'A window overlaid on the primary window, rendering the content underneath inert.',
    ja: 'プライマリウィンドウの上に重なるウィンドウで、背後のコンテンツを不活性にします。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      label: {
        en: 'WAI-ARIA APG: Dialog (Modal) Pattern',
        ja: 'WAI-ARIA APG: Dialog (Modal) パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Dialog.tsx',
      testFile: 'Dialog.test.tsx',
      lang: 'tsx',
      usageCode: `import { DialogRoot, DialogTrigger, Dialog } from './Dialog';

function App() {
  return (
    <DialogRoot onOpenChange={(open) => console.log('Dialog:', open)}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <Dialog
        title="Dialog Title"
        description="Optional description text"
      >
        <p>Dialog content goes here.</p>
      </Dialog>
    </DialogRoot>
  );
}`,
      apiProps: [
        {
          name: 'children',
          type: 'ReactNode',
          default: 'required',
          description: {
            en: 'DialogTrigger and Dialog components (DialogRoot)',
            ja: 'DialogTrigger と Dialog コンポーネント（DialogRoot）',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial open state (DialogRoot)',
            ja: '初期の開閉状態（DialogRoot）',
          },
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when open state changes (DialogRoot)',
            ja: '開閉状態が変更されたときのコールバック（DialogRoot）',
          },
        },
        {
          name: 'title',
          type: 'string',
          default: 'required',
          description: {
            en: 'Dialog title (for accessibility)',
            ja: 'ダイアログのタイトル（アクセシビリティ用）',
          },
        },
        {
          name: 'description',
          type: 'string',
          default: '-',
          description: {
            en: 'Optional description text',
            ja: '任意の説明テキスト',
          },
        },
        {
          name: 'children',
          type: 'ReactNode',
          default: 'required',
          description: {
            en: 'Dialog content',
            ja: 'ダイアログのコンテンツ',
          },
        },
        {
          name: 'closeOnOverlayClick',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Close when clicking overlay',
            ja: 'オーバーレイクリック時に閉じる',
          },
        },
      ],
      apiNote: {
        en: 'This pattern uses compound components: <code>&lt;DialogRoot&gt;</code>, <code>&lt;DialogTrigger&gt;</code>, and <code>&lt;Dialog&gt;</code>. The first three props above belong to <code>&lt;DialogRoot&gt;</code>, and the rest belong to <code>&lt;Dialog&gt;</code>.',
        ja: 'このパターンは複合コンポーネントを使用します: <code>&lt;DialogRoot&gt;</code>、<code>&lt;DialogTrigger&gt;</code>、<code>&lt;Dialog&gt;</code>。上記の最初の3つのプロパティは <code>&lt;DialogRoot&gt;</code> に、残りは <code>&lt;Dialog&gt;</code> に属します。',
      },
    },
    vue: {
      sourceFile: 'Dialog.vue',
      testFile: 'Dialog.test.vue.ts',
      lang: 'vue',
      usageCode: `<template>
  <Dialog
    title="Dialog Title"
    description="Optional description text"
    @open-change="handleOpenChange"
  >
    <template #trigger="{ open }">
      <button @click="open" class="btn-primary">Open Dialog</button>
    </template>
    <p>Dialog content goes here.</p>
  </Dialog>
</template>

<script setup>
import Dialog from './Dialog.vue';

function handleOpenChange(open) {
  console.log('Dialog:', open);
}
</script>`,
      apiProps: [
        {
          name: 'title',
          type: 'string',
          default: 'required',
          description: {
            en: 'Dialog title (for accessibility)',
            ja: 'ダイアログのタイトル（アクセシビリティ用）',
          },
        },
        {
          name: 'description',
          type: 'string',
          default: '-',
          description: {
            en: 'Optional description text',
            ja: 'オプションの説明文',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial open state',
            ja: '初期の開閉状態',
          },
        },
        {
          name: 'closeOnOverlayClick',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Close when clicking overlay',
            ja: 'オーバーレイクリックで閉じる',
          },
        },
      ],
      apiSlots: [
        {
          name: 'trigger',
          default: '{ open: () => void }',
          description: {
            en: 'Trigger element to open the dialog',
            ja: 'ダイアログを開くトリガー要素',
          },
        },
        {
          name: 'default',
          default: '-',
          description: {
            en: 'Dialog content',
            ja: 'ダイアログのコンテンツ',
          },
        },
      ],
      apiEvents: [
        {
          name: 'openChange',
          detail: 'boolean',
          description: {
            en: 'Emitted when open state changes',
            ja: '開閉状態が変更されたときに発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Dialog.svelte',
      testFile: 'Dialog.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script>
  import Dialog from './Dialog.svelte';

  function handleOpenChange(open) {
    console.log('Dialog:', open);
  }
</script>

<Dialog
  title="Dialog Title"
  description="Optional description text"
  onOpenChange={handleOpenChange}
>
  {#snippet trigger({ open })}
    <button onclick={open} class="btn-primary">Open Dialog</button>
  {/snippet}
  {#snippet children()}
    <p>Dialog content goes here.</p>
  {/snippet}
</Dialog>`,
      apiProps: [
        {
          name: 'title',
          type: 'string',
          default: 'required',
          description: {
            en: 'Dialog title (for accessibility)',
            ja: 'ダイアログのタイトル（アクセシビリティ用）',
          },
        },
        {
          name: 'description',
          type: 'string',
          default: '-',
          description: {
            en: 'Optional description text',
            ja: 'オプションの説明テキスト',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Initial open state',
            ja: '初期のオープン状態',
          },
        },
        {
          name: 'closeOnOverlayClick',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Close when clicking overlay',
            ja: 'オーバーレイをクリックしたときに閉じるかどうか',
          },
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          default: '-',
          description: {
            en: 'Callback when open state changes',
            ja: 'オープン状態が変更されたときのコールバック',
          },
        },
      ],
      apiSlots: [
        {
          name: 'trigger',
          default: '{ open: () => void }',
          description: {
            en: 'Trigger element to open the dialog',
            ja: 'ダイアログを開くトリガー要素',
          },
        },
        {
          name: 'children',
          default: '-',
          description: {
            en: 'Dialog content',
            ja: 'ダイアログのコンテンツ',
          },
        },
      ],
      apiNote: {
        en: 'Exported functions: <code>open()</code> opens the dialog programmatically, <code>close()</code> closes the dialog programmatically.',
        ja: 'エクスポートされた関数: <code>open()</code> プログラムでダイアログを開く、<code>close()</code> プログラムでダイアログを閉じる。',
      },
    },
    astro: {
      sourceFile: 'Dialog.astro',
      lang: 'astro',
      usageCode: `---
import Dialog from './Dialog.astro';
---

<Dialog
  title="Dialog Title"
  description="Optional description text"
  triggerText="Open Dialog"
>
  <p>Dialog content goes here.</p>
</Dialog>`,
      apiProps: [
        {
          name: 'title',
          type: 'string',
          default: 'required',
          description: {
            en: 'Dialog title (for accessibility)',
            ja: 'ダイアログのタイトル（アクセシビリティ用）',
          },
        },
        {
          name: 'description',
          type: 'string',
          default: '-',
          description: {
            en: 'Optional description text',
            ja: 'オプションの説明テキスト',
          },
        },
        {
          name: 'triggerText',
          type: 'string',
          default: 'required',
          description: {
            en: 'Text for the trigger button',
            ja: 'トリガーボタンのテキスト',
          },
        },
        {
          name: 'closeOnOverlayClick',
          type: 'boolean',
          default: 'true',
          description: {
            en: 'Close when clicking overlay',
            ja: 'オーバーレイクリックで閉じる',
          },
        },
        {
          name: 'triggerClass',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class for trigger button',
            ja: 'トリガーボタンの追加CSSクラス',
          },
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class for dialog',
            ja: 'ダイアログの追加CSSクラス',
          },
        },
      ],
      apiSlots: [
        {
          name: 'default',
          default: '-',
          description: {
            en: 'Dialog content',
            ja: 'ダイアログのコンテンツ',
          },
        },
      ],
      apiEvents: [
        {
          name: 'dialogopen',
          detail: '-',
          description: {
            en: 'Fired when the dialog opens',
            ja: 'ダイアログが開いたときに発火',
          },
        },
        {
          name: 'dialogclose',
          detail: '-',
          description: {
            en: 'Fired when the dialog closes',
            ja: 'ダイアログが閉じたときに発火',
          },
        },
      ],
    },
  },
};

export default dialogMeta;
