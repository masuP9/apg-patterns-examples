import type { PatternMeta } from '@/lib/pattern-meta-types';

const alertDialogMeta: PatternMeta = {
  title: {
    en: 'Alert Dialog',
    ja: 'Alert Dialog',
  },
  description: {
    en: "A modal dialog that interrupts the user's workflow to communicate an important message and require a response.",
    ja: 'ユーザーのワークフローを中断し、重要なメッセージを伝えて応答を求めるモーダルダイアログ。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/',
      label: {
        en: 'WAI-ARIA APG: Alert Dialog Pattern',
        ja: 'WAI-ARIA APG: Alert Dialog パターン',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'AlertDialog.tsx',
      testFile: 'AlertDialog.test.tsx',
      lang: 'tsx',
      usageCode: `import { AlertDialogRoot, AlertDialogTrigger, AlertDialog } from './AlertDialog';

function App() {
  const handleDelete = () => {
    // Perform delete action
    console.log('Item deleted');
  };

  return (
    <AlertDialogRoot>
      <AlertDialogTrigger className="bg-destructive text-destructive-foreground px-4 py-2 rounded">
        Delete Item
      </AlertDialogTrigger>
      <AlertDialog
        title="Delete this item?"
        message="This action cannot be undone. This will permanently delete the item."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => console.log('Cancelled')}
      />
    </AlertDialogRoot>
  );
}`,
      apiProps: [
        {
          name: 'children',
          type: 'ReactNode',
          default: 'required',
          description: {
            en: 'AlertDialogRoot: AlertDialogTrigger and AlertDialog components',
            ja: 'AlertDialogRoot: AlertDialogTrigger と AlertDialog コンポーネント',
          },
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'AlertDialogRoot: Initial open state',
            ja: 'AlertDialogRoot: 初期の開閉状態',
          },
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          default: '-',
          description: {
            en: 'AlertDialogRoot: Callback when open state changes',
            ja: 'AlertDialogRoot: 開閉状態が変更されたときのコールバック',
          },
        },
        {
          name: 'title',
          type: 'string',
          default: 'required',
          description: {
            en: 'AlertDialog: Alert dialog title',
            ja: 'AlertDialog: アラートダイアログのタイトル',
          },
        },
        {
          name: 'message',
          type: 'string',
          default: 'required',
          description: {
            en: 'AlertDialog: Alert message (required for accessibility)',
            ja: 'AlertDialog: アラートメッセージ（アクセシビリティ上必須）',
          },
        },
        {
          name: 'confirmLabel',
          type: 'string',
          default: '"OK"',
          description: {
            en: 'AlertDialog: Confirm button label',
            ja: 'AlertDialog: 確認ボタンのラベル',
          },
        },
        {
          name: 'cancelLabel',
          type: 'string',
          default: '"Cancel"',
          description: {
            en: 'AlertDialog: Cancel button label',
            ja: 'AlertDialog: キャンセルボタンのラベル',
          },
        },
        {
          name: 'confirmVariant',
          type: "'default' | 'danger'",
          default: "'default'",
          description: {
            en: 'AlertDialog: Confirm button visual style',
            ja: 'AlertDialog: 確認ボタンのスタイル',
          },
        },
        {
          name: 'allowEscapeClose',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'AlertDialog: Allow closing with Escape key',
            ja: 'AlertDialog: Escape キーで閉じることを許可',
          },
        },
        {
          name: 'onConfirm',
          type: '() => void',
          default: '-',
          description: {
            en: 'AlertDialog: Callback when Confirm is clicked',
            ja: 'AlertDialog: 確認ボタンクリック時のコールバック',
          },
        },
        {
          name: 'onCancel',
          type: '() => void',
          default: '-',
          description: {
            en: 'AlertDialog: Callback when Cancel is clicked',
            ja: 'AlertDialog: キャンセルボタンクリック時のコールバック',
          },
        },
      ],
      apiNote: {
        en: 'The React implementation uses a compound component pattern: <code>&lt;AlertDialogRoot&gt;</code> manages state, <code>&lt;AlertDialogTrigger&gt;</code> opens the dialog, and <code>&lt;AlertDialog&gt;</code> renders the modal.',
        ja: 'React 実装はコンパウンドコンポーネントパターンを使用しています: <code>&lt;AlertDialogRoot&gt;</code> が状態を管理し、<code>&lt;AlertDialogTrigger&gt;</code> がダイアログを開き、<code>&lt;AlertDialog&gt;</code> がモーダルをレンダリングします。',
      },
    },
    vue: {
      sourceFile: 'AlertDialog.vue',
      testFile: 'AlertDialog.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import AlertDialog from './AlertDialog.vue';

const handleDelete = () => {
  console.log('Item deleted');
};
</script>

<template>
  <AlertDialog
    title="Delete this item?"
    message="This action cannot be undone. This will permanently delete the item."
    confirmLabel="Delete"
    cancelLabel="Cancel"
    confirmVariant="danger"
    @confirm="handleDelete"
    @cancel="() => console.log('Cancelled')"
  >
    <template #trigger="{ open }">
      <button @click="open" class="bg-destructive text-destructive-foreground px-4 py-2 rounded">
        Delete Item
      </button>
    </template>
  </AlertDialog>
</template>`,
      apiProps: [
        {
          name: 'title',
          type: 'string',
          default: 'required',
          description: {
            en: 'Alert dialog title',
            ja: 'アラートダイアログのタイトル',
          },
        },
        {
          name: 'message',
          type: 'string',
          default: 'required',
          description: {
            en: 'Alert message (required for accessibility)',
            ja: 'アラートメッセージ（アクセシビリティ上必須）',
          },
        },
        {
          name: 'confirmLabel',
          type: 'string',
          default: '"OK"',
          description: {
            en: 'Confirm button label',
            ja: '確認ボタンのラベル',
          },
        },
        {
          name: 'cancelLabel',
          type: 'string',
          default: '"Cancel"',
          description: {
            en: 'Cancel button label',
            ja: 'キャンセルボタンのラベル',
          },
        },
        {
          name: 'confirmVariant',
          type: "'default' | 'danger'",
          default: "'default'",
          description: {
            en: 'Confirm button visual style',
            ja: '確認ボタンのスタイル',
          },
        },
        {
          name: 'allowEscapeClose',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Allow closing with Escape key',
            ja: 'Escape キーで閉じることを許可',
          },
        },
      ],
      apiSlots: [
        {
          name: '#trigger',
          default: '-',
          description: {
            en: 'Trigger element with open function ({ open })',
            ja: 'open 関数を持つトリガー要素 ({ open })',
          },
        },
      ],
      apiEvents: [
        {
          name: '@confirm',
          detail: '-',
          description: {
            en: 'Emitted when Confirm button is clicked',
            ja: '確認ボタンがクリックされたときに発火',
          },
        },
        {
          name: '@cancel',
          detail: '-',
          description: {
            en: 'Emitted when Cancel button is clicked',
            ja: 'キャンセルボタンがクリックされたときに発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'AlertDialog.svelte',
      testFile: 'AlertDialog.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';

  const handleDelete = () => {
    console.log('Item deleted');
  };
</script>

<AlertDialog
  title="Delete this item?"
  message="This action cannot be undone. This will permanently delete the item."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onCancel={() => console.log('Cancelled')}
>
  {#snippet trigger({ open })}
    <button onclick={open} class="bg-destructive text-destructive-foreground px-4 py-2 rounded">
      Delete Item
    </button>
  {/snippet}
</AlertDialog>`,
      apiProps: [
        {
          name: 'title',
          type: 'string',
          default: 'required',
          description: {
            en: 'Alert dialog title',
            ja: 'アラートダイアログのタイトル',
          },
        },
        {
          name: 'message',
          type: 'string',
          default: 'required',
          description: {
            en: 'Alert message (required for accessibility)',
            ja: 'アラートメッセージ（アクセシビリティ上必須）',
          },
        },
        {
          name: 'confirmLabel',
          type: 'string',
          default: '"OK"',
          description: {
            en: 'Confirm button label',
            ja: '確認ボタンのラベル',
          },
        },
        {
          name: 'cancelLabel',
          type: 'string',
          default: '"Cancel"',
          description: {
            en: 'Cancel button label',
            ja: 'キャンセルボタンのラベル',
          },
        },
        {
          name: 'confirmVariant',
          type: "'default' | 'danger'",
          default: "'default'",
          description: {
            en: 'Confirm button visual style',
            ja: '確認ボタンのスタイル',
          },
        },
        {
          name: 'allowEscapeClose',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Allow closing with Escape key',
            ja: 'Escape キーで閉じることを許可',
          },
        },
        {
          name: 'onConfirm',
          type: '() => void',
          default: '-',
          description: {
            en: 'Callback when Confirm is clicked',
            ja: '確認ボタンクリック時のコールバック',
          },
        },
        {
          name: 'onCancel',
          type: '() => void',
          default: '-',
          description: {
            en: 'Callback when Cancel is clicked',
            ja: 'キャンセルボタンクリック時のコールバック',
          },
        },
      ],
      apiSlots: [
        {
          name: 'trigger',
          default: '-',
          description: {
            en: 'Trigger element with open function ({ open })',
            ja: 'open 関数を持つトリガー要素 ({ open })',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'AlertDialog.astro',
      testFile: 'AlertDialog.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import AlertDialog from './AlertDialog.astro';
---

<AlertDialog
  title="Delete this item?"
  message="This action cannot be undone. This will permanently delete the item."
  triggerText="Delete Item"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  confirmVariant="danger"
  triggerClass="bg-destructive text-destructive-foreground px-4 py-2 rounded"
/>

<script>
  // Listen for custom events
  document.querySelector('apg-alert-dialog')?.addEventListener('confirm', () => {
    console.log('Confirmed!');
  });
</script>`,
      apiProps: [
        {
          name: 'title',
          type: 'string',
          default: 'required',
          description: {
            en: 'Alert dialog title',
            ja: 'アラートダイアログのタイトル',
          },
        },
        {
          name: 'message',
          type: 'string',
          default: 'required',
          description: {
            en: 'Alert message (required for accessibility)',
            ja: 'アラートメッセージ（アクセシビリティ上必須）',
          },
        },
        {
          name: 'triggerText',
          type: 'string',
          default: 'required',
          description: {
            en: 'Trigger button text',
            ja: 'トリガーボタンのテキスト',
          },
        },
        {
          name: 'confirmLabel',
          type: 'string',
          default: '"OK"',
          description: {
            en: 'Confirm button label',
            ja: '確認ボタンのラベル',
          },
        },
        {
          name: 'cancelLabel',
          type: 'string',
          default: '"Cancel"',
          description: {
            en: 'Cancel button label',
            ja: 'キャンセルボタンのラベル',
          },
        },
        {
          name: 'confirmVariant',
          type: "'default' | 'danger'",
          default: "'default'",
          description: {
            en: 'Confirm button visual style',
            ja: '確認ボタンのスタイル',
          },
        },
        {
          name: 'allowEscapeClose',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Allow closing with Escape key',
            ja: 'Escape キーで閉じることを許可',
          },
        },
        {
          name: 'triggerClass',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class for trigger button',
            ja: 'トリガーボタンの追加 CSS クラス',
          },
        },
      ],
      apiEvents: [
        {
          name: 'confirm',
          detail: '-',
          description: {
            en: 'Fired when Confirm button is clicked',
            ja: '確認ボタンがクリックされたときに発火',
          },
        },
        {
          name: 'cancel',
          detail: '-',
          description: {
            en: 'Fired when Cancel button is clicked',
            ja: 'キャンセルボタンがクリックされたときに発火',
          },
        },
        {
          name: 'alertdialogopen',
          detail: '-',
          description: {
            en: 'Fired when dialog opens',
            ja: 'ダイアログが開いたときに発火',
          },
        },
        {
          name: 'alertdialogclose',
          detail: '-',
          description: {
            en: 'Fired when dialog closes',
            ja: 'ダイアログが閉じたときに発火',
          },
        },
      ],
      apiNote: {
        en: 'This component uses a Web Component (<code>&lt;apg-alert-dialog&gt;</code>) for client-side interactivity.',
        ja: 'このコンポーネントは、クライアントサイドのインタラクティビティのためにWeb Component（<code>&lt;apg-alert-dialog&gt;</code>）を使用しています。',
      },
    },
  },
};

export default alertDialogMeta;
