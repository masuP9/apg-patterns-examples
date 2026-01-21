/**
 * Alert Dialog Pattern - Accessibility Data
 *
 * Single source of truth for accessibility documentation.
 * Used by AccessibilityDocs.astro and for generating alert-dialog.md / alert-dialog.ja.md
 */

import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const alertDialogAccessibilityData: PatternAccessibilityData = {
  pattern: 'alert-dialog',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/',

  overview: {
    en: 'An alert dialog is a modal dialog that interrupts the user\'s workflow to communicate an important message and require a response. Unlike regular dialogs, it uses role="alertdialog" which may trigger system alert sounds in assistive technologies.',
    ja: 'アラートダイアログは、ユーザーのワークフローを中断して重要なメッセージを伝え、応答を求めるモーダルダイアログです。通常のダイアログとは異なり、role="alertdialog" を使用し、支援技術でシステムのアラート音がトリガーされる場合があります。',
  },

  // --- ARIA Roles ---
  roles: [
    {
      name: 'alertdialog',
      element: {
        en: 'Dialog container',
        ja: 'ダイアログコンテナ',
      },
      description: {
        en: "A type of dialog that interrupts the user's workflow to communicate an important message and require a response. May trigger system alert sounds in assistive technologies.",
        ja: 'ユーザーのワークフローを中断して重要なメッセージを伝え、応答を求めるダイアログの一種。支援技術でシステムのアラート音がトリガーされる場合があります。',
      },
    },
  ],

  // --- ARIA Properties ---
  properties: [
    {
      attribute: 'aria-modal',
      element: 'alertdialog',
      values: 'true',
      required: {
        en: 'Implicit',
        ja: '暗黙的',
      },
      notes: {
        en: 'Provided automatically by showModal(). No explicit attribute needed when using native <dialog> element.',
        ja: 'showModal() によって自動的に提供される。ネイティブの <dialog> 要素使用時は明示的な属性は不要。',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'alertdialog',
      values: {
        en: 'ID reference to title element',
        ja: 'タイトル要素への ID 参照',
      },
      required: true,
      notes: {
        en: 'References the alert dialog title',
        ja: 'アラートダイアログのタイトルを参照する',
      },
    },
    {
      attribute: 'aria-describedby',
      element: 'alertdialog',
      values: {
        en: 'ID reference to message',
        ja: 'メッセージへの ID 参照',
      },
      required: {
        en: 'Yes (required)',
        ja: 'はい（必須）',
      },
      notes: {
        en: "References the alert message. Unlike regular Dialog, this is required for Alert Dialog as the message is central to the user's understanding of what action is being confirmed.",
        ja: 'アラートメッセージを参照する。通常の Dialog とは異なり、Alert Dialog ではメッセージがユーザーの意思決定を理解する上で中心的であるため、この属性は必須です。',
      },
    },
  ],

  // --- Keyboard Support ---
  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Move focus to next focusable element within dialog. When focus is on the last element, moves to first.',
        ja: 'ダイアログ内の次のフォーカス可能な要素にフォーカスを移動する。最後の要素にフォーカスがある場合は最初の要素に移動する。',
      },
    },
    {
      key: 'Shift + Tab',
      action: {
        en: 'Move focus to previous focusable element within dialog. When focus is on the first element, moves to last.',
        ja: 'ダイアログ内の前のフォーカス可能な要素にフォーカスを移動する。最初の要素にフォーカスがある場合は最後の要素に移動する。',
      },
    },
    {
      key: 'Escape',
      action: {
        en: 'Disabled by default. Unlike regular Dialog, Alert Dialog prevents Escape key closure to ensure users explicitly respond to the alert. Can be enabled via allowEscapeClose prop for non-critical alerts.',
        ja: 'デフォルトでは無効。通常の Dialog とは異なり、アラートダイアログではユーザーに明示的に応答させるため、Escape キーによる閉じる動作を防止します。allowEscapeClose プロパティで重要度の低いアラートに対して有効にすることができます。',
      },
    },
    {
      key: 'Enter',
      action: {
        en: 'Activates the focused button',
        ja: 'フォーカスされているボタンを実行する',
      },
    },
    {
      key: 'Space',
      action: {
        en: 'Activates the focused button',
        ja: 'フォーカスされているボタンを実行する',
      },
    },
  ],

  // --- Focus Management ---
  focusManagement: [
    {
      event: {
        en: 'Dialog opens',
        ja: 'ダイアログが開く',
      },
      behavior: {
        en: 'Focus moves to the Cancel button (safest action). This differs from regular Dialog which focuses the first focusable element.',
        ja: 'フォーカスはキャンセルボタン（最も安全なアクション）に移動する。これは最初のフォーカス可能な要素にフォーカスする通常の Dialog とは異なります。',
      },
    },
    {
      event: {
        en: 'Dialog closes',
        ja: 'ダイアログが閉じる',
      },
      behavior: {
        en: 'Focus returns to the element that triggered the dialog',
        ja: 'ダイアログを開いた要素にフォーカスが戻る',
      },
    },
    {
      event: {
        en: 'Focus trap',
        ja: 'フォーカストラップ',
      },
      behavior: {
        en: 'Tab/Shift+Tab cycles through focusable elements within the dialog only',
        ja: 'Tab/Shift+Tab はダイアログ内のフォーカス可能な要素間のみをサイクルする',
      },
    },
    {
      event: {
        en: 'Background',
        ja: '背景',
      },
      behavior: {
        en: 'Content outside dialog is made inert (not focusable or interactive)',
        ja: 'ダイアログ外のコンテンツは不活性化される（フォーカス不可・操作不可）',
      },
    },
  ],

  // --- Additional Notes ---
  additionalNotes: [
    {
      en: 'Alert Dialog is for critical messages that require user acknowledgment or a decision. For general content, use regular Dialog.',
      ja: 'Alert Dialog はユーザーの確認や意思決定を必要とする重要なメッセージ用です。一般的なコンテンツには通常の Dialog を使用してください。',
    },
    {
      en: 'The alertdialog role may cause assistive technologies to announce the dialog more urgently or with an alert sound.',
      ja: 'alertdialog ロールにより、支援技術はより緊急にダイアログを読み上げたり、アラート音を鳴らしたりする場合があります。',
    },
    {
      en: "Both title and message are required to provide complete context for the user's decision.",
      ja: 'タイトルとメッセージの両方が、ユーザーの意思決定に完全なコンテキストを提供するために必要です。',
    },
    {
      en: 'The Cancel button should always be the safest choice (no destructive action).',
      ja: 'キャンセルボタンは常に最も安全な選択（破壊的なアクションを行わない）であるべきです。',
    },
    {
      en: 'Consider using the danger variant for destructive actions to provide visual distinction.',
      ja: '破壊的なアクションには視覚的な区別を提供するために danger バリアントの使用を検討してください。',
    },
  ],

  // --- References ---
  references: [
    {
      title: 'WAI-ARIA alertdialog role',
      url: 'https://w3c.github.io/aria/#alertdialog',
    },
  ],

  // --- Testing Data ---
  testing: {
    strategies: [
      {
        type: 'unit',
        title: {
          en: 'Unit Tests (Testing Library / jest-axe)',
          ja: 'ユニットテスト (Testing Library / jest-axe)',
        },
        description: {
          en: "Verify the component's HTML output, ARIA attributes, and accessibility. These tests ensure correct rendering and compliance with APG requirements.",
          ja: 'コンポーネントのHTML出力、ARIA属性、およびアクセシビリティを検証します。これらのテストは正しいレンダリングとAPG要件への準拠を保証します。',
        },
        areas: [
          { en: 'role="alertdialog" (NOT dialog)', ja: 'role="alertdialog"（dialog ではない）' },
          {
            en: 'aria-labelledby and aria-describedby attributes',
            ja: 'aria-labelledby と aria-describedby 属性',
          },
          { en: 'Modal behavior via showModal()', ja: 'showModal() によるモーダル動作' },
          { en: 'WCAG 2.1 AA compliance via axe-core', ja: 'axe-core による WCAG 2.1 AA 準拠' },
          {
            en: 'Props behavior (allowEscapeClose, confirmVariant)',
            ja: 'プロパティ動作（allowEscapeClose, confirmVariant）',
          },
        ],
      },
      {
        type: 'e2e',
        title: {
          en: 'E2E Tests (Playwright)',
          ja: 'E2E テスト (Playwright)',
        },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks (React, Vue, Svelte, Astro). These tests cover interactions requiring JavaScript execution.',
          ja: 'すべてのフレームワーク（React、Vue、Svelte、Astro）で実際のブラウザ環境でのコンポーネント動作を検証します。JavaScript 実行を必要とするインタラクションをカバーします。',
        },
        areas: [
          {
            en: 'Focus on Cancel button when dialog opens (safest action)',
            ja: 'ダイアログ表示時にキャンセルボタンにフォーカス（最も安全なアクション）',
          },
          {
            en: 'Tab/Shift+Tab wrap within dialog (focus trap)',
            ja: 'Tab/Shift+Tab がダイアログ内でラップする（フォーカストラップ）',
          },
          {
            en: 'Enter/Space activates focused button',
            ja: 'Enter/Space でフォーカスされたボタンを実行',
          },
          { en: 'Escape key disabled by default', ja: 'デフォルトで Escape キー無効' },
          { en: 'Focus returns to trigger on close', ja: '閉じる時に開いた要素にフォーカスが戻る' },
          {
            en: 'No close button (×) unlike regular Dialog',
            ja: '通常の Dialog と違い閉じるボタン（×）がない',
          },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: {
          en: 'APG Keyboard Interaction',
          ja: 'APG キーボード操作（Unit + E2E）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Escape key (disabled)',
            description: {
              en: 'Escape does NOT close the dialog by default',
              ja: 'デフォルトでは Escape キーでダイアログを閉じない',
            },
          },
          {
            name: 'Escape key (enabled)',
            description: {
              en: 'Escape closes the dialog when allowEscapeClose is true',
              ja: 'allowEscapeClose が true の場合、Escape でダイアログを閉じる',
            },
          },
          {
            name: 'Enter on button',
            description: {
              en: 'Activates the focused button',
              ja: 'フォーカスされたボタンを実行する',
            },
          },
          {
            name: 'Space on button',
            description: {
              en: 'Activates the focused button',
              ja: 'フォーカスされたボタンを実行する',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'APG ARIA Attributes',
          ja: 'APG ARIA 属性（Unit + E2E）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="alertdialog"',
            description: {
              en: 'Dialog element has alertdialog role (not dialog)',
              ja: 'ダイアログ要素に alertdialog ロールがある（dialog ではない）',
            },
          },
          {
            name: 'Modal behavior',
            description: {
              en: 'Opened via showModal() (verified by ::backdrop existence)',
              ja: 'showModal() で開かれている（::backdrop の存在で確認）',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'References the alert dialog title',
              ja: 'アラートダイアログのタイトルを参照する',
            },
          },
          {
            name: 'aria-describedby',
            description: {
              en: 'References the alert message (required, unlike Dialog)',
              ja: 'アラートメッセージを参照する（Dialog とは異なり必須）',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Focus Management',
          ja: 'フォーカス管理（E2E）',
        },
        testType: 'E2E',
        items: [
          {
            name: 'Initial focus',
            description: {
              en: 'Focus moves to Cancel button on open (safest action)',
              ja: '開いたときにキャンセルボタンにフォーカスが移動する（最も安全なアクション）',
            },
          },
          {
            name: 'Focus restore',
            description: {
              en: 'Focus returns to trigger on close',
              ja: '閉じたときに開いた要素にフォーカスが戻る',
            },
          },
          {
            name: 'Focus trap',
            description: {
              en: 'Tab cycling stays within dialog (via native dialog)',
              ja: 'Tab サイクルがダイアログ内に留まる（ネイティブ dialog 経由）',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Accessibility',
          ja: 'アクセシビリティ（Unit + E2E）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'axe violations',
            description: {
              en: 'No WCAG 2.1 AA violations (via jest-axe)',
              ja: 'WCAG 2.1 AA 違反がない（jest-axe 経由）',
            },
          },
          {
            name: 'Title and message',
            description: {
              en: 'Both are rendered and properly associated',
              ja: '両方がレンダリングされ、適切に関連付けられている',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: {
          en: 'Props & Behavior',
          ja: 'プロパティと動作（Unit）',
        },
        testType: 'Unit',
        items: [
          {
            name: 'allowEscapeClose',
            description: {
              en: 'Controls Escape key behavior (default: false)',
              ja: 'Escape キーの動作を制御する（デフォルト: false）',
            },
          },
          {
            name: 'confirmVariant',
            description: {
              en: 'Danger variant applies correct styling',
              ja: 'danger バリアントが正しいスタイリングを適用する',
            },
          },
          {
            name: 'onConfirm',
            description: {
              en: 'Callback fires when Confirm button is clicked',
              ja: '確認ボタンがクリックされたときにコールバックが発火する',
            },
          },
          {
            name: 'onCancel',
            description: {
              en: 'Callback fires when Cancel button is clicked',
              ja: 'キャンセルボタンがクリックされたときにコールバックが発火する',
            },
          },
          {
            name: 'className',
            description: {
              en: 'Custom classes are applied',
              ja: 'カスタムクラスが適用される',
            },
          },
        ],
      },
    ],
    commands: [
      {
        comment: {
          en: 'Run all AlertDialog unit tests',
          ja: 'AlertDialog の全ユニットテストを実行',
        },
        command: 'npm run test:unit -- AlertDialog',
      },
      {
        comment: {
          en: 'Run framework-specific tests',
          ja: 'フレームワーク別テストを実行',
        },
        command:
          'npm run test:react -- AlertDialog.test.tsx\nnpm run test:vue -- AlertDialog.test.vue.ts\nnpm run test:svelte -- AlertDialog.test.svelte.ts\nnpm run test:astro',
      },
      {
        comment: {
          en: 'Run all Alert Dialog E2E tests',
          ja: 'Alert Dialog の全 E2E テストを実行',
        },
        command: 'npm run test:e2e -- alert-dialog.spec.ts',
      },
      {
        comment: {
          en: 'Run in UI mode',
          ja: 'UI モードで実行',
        },
        command: 'npm run test:e2e:ui -- alert-dialog.spec.ts',
      },
    ],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: { en: 'Test runner', ja: 'テストランナー' },
      },
      {
        name: 'Testing Library',
        url: 'https://testing-library.com/',
        description: {
          en: 'Framework-specific testing utilities',
          ja: 'フレームワーク固有のテストユーティリティ',
        },
      },
      {
        name: 'jest-axe',
        url: 'https://github.com/nickcolley/jest-axe',
        description: {
          en: 'Automated accessibility testing',
          ja: '自動アクセシビリティテスト',
        },
      },
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: {
          en: 'E2E testing for cross-framework validation',
          ja: 'クロスフレームワーク検証のための E2E テスト',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- Test Checklist (for llm.md) ---
  testChecklist: [
    // High Priority: ARIA
    {
      description: 'Container has role="alertdialog" (NOT dialog)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Is modal (opened via showModal(), confirmed by ::backdrop existence)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Has aria-labelledby referencing title element',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Has aria-describedby referencing message element (required)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Title element id matches aria-labelledby value',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Message element id matches aria-describedby value',
      priority: 'high',
      category: 'aria',
    },
    // High Priority: Keyboard
    { description: 'Tab moves to next focusable element', priority: 'high', category: 'keyboard' },
    {
      description: 'Shift+Tab moves to previous focusable element',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Tab wraps from last to first element', priority: 'high', category: 'keyboard' },
    {
      description: 'Shift+Tab wraps from first to last element',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Escape does NOT close when allowEscapeClose=false',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Escape closes when allowEscapeClose=true',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Enter activates focused button', priority: 'high', category: 'keyboard' },
    { description: 'Space activates focused button', priority: 'high', category: 'keyboard' },
    // High Priority: Focus
    {
      description: 'Focus moves to Cancel button on open (safest action)',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Focus is trapped within dialog', priority: 'high', category: 'focus' },
    {
      description: 'Focus returns to trigger on close (E2E only - jsdom limitation)',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Background content is inert', priority: 'high', category: 'focus' },
    // Medium Priority: Accessibility
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  // --- Implementation Notes ---
  implementationNotes: `Structure (uses native <dialog> element):
┌─────────────────────────────────────────────────┐
│ <dialog role="alertdialog">                     │
│   aria-labelledby="title-id"                    │
│   aria-describedby="message-id"                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ <h2 id="title-id">Confirm Delete</h2>       │ │
│ ├─────────────────────────────────────────────┤ │
│ │ <p id="message-id">                         │ │
│ │   This action cannot be undone.             │ │
│ │ </p>                                        │ │
│ ├─────────────────────────────────────────────┤ │
│ │ [Cancel] ← initial focus    [Delete]        │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

Key Implementation Points:
- Uses native <dialog> element with showModal() for modal behavior
- showModal() provides: backdrop, focus trap, inert background
- NO explicit aria-modal needed (showModal() handles it implicitly)
- NO close button (×) by default
- Cancel button receives initial focus (safest action)
- Escape disabled by default (allowEscapeClose=false)
- aria-describedby is REQUIRED (message prop required)`,

  // --- Example Test Code ---
  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Role check (NOT dialog)
it('has role="alertdialog"', () => {
  render(<AlertDialog title="Confirm" message="Are you sure?" open />);
  expect(screen.getByRole('alertdialog')).toBeInTheDocument();
});

// aria-describedby is required
it('has aria-describedby referencing message', () => {
  render(<AlertDialog title="Confirm" message="Are you sure?" open />);
  const dialog = screen.getByRole('alertdialog');
  expect(dialog).toHaveAttribute('aria-describedby');
  const messageId = dialog.getAttribute('aria-describedby');
  expect(document.getElementById(messageId!)).toHaveTextContent('Are you sure?');
});

// Initial focus on cancel (safe action)
it('focuses cancel button on open', async () => {
  render(<AlertDialog title="Confirm" message="Delete?" open />);
  const cancelButton = screen.getByRole('button', { name: /cancel/i });
  expect(cancelButton).toHaveFocus();
});

// Escape disabled by default
it('does NOT close on Escape by default', async () => {
  const onCancel = vi.fn();
  const user = userEvent.setup();
  render(<AlertDialog title="Confirm" message="Delete?" open onCancel={onCancel} />);

  await user.keyboard('{Escape}');
  expect(onCancel).not.toHaveBeenCalled();
  expect(screen.getByRole('alertdialog')).toBeInTheDocument();
});

// Escape closes when allowed
it('closes on Escape when allowEscapeClose=true', async () => {
  const onCancel = vi.fn();
  const user = userEvent.setup();
  render(
    <AlertDialog
      title="Info"
      message="Note this."
      open
      allowEscapeClose
      onCancel={onCancel}
    />
  );

  await user.keyboard('{Escape}');
  expect(onCancel).toHaveBeenCalled();
});

// Focus trap
it('traps focus within dialog', async () => {
  const user = userEvent.setup();
  render(<AlertDialog title="Confirm" message="Delete?" open />);

  const cancelButton = screen.getByRole('button', { name: /cancel/i });
  const confirmButton = screen.getByRole('button', { name: /ok|confirm|delete/i });

  expect(cancelButton).toHaveFocus();
  await user.tab();
  expect(confirmButton).toHaveFocus();
  await user.tab();
  expect(cancelButton).toHaveFocus(); // wraps
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';

// Helper to open alert dialog
const openAlertDialog = async (page) => {
  const trigger = page.getByRole('button', { name: /open alert|delete|confirm/i }).first();
  await trigger.click();
  await page.waitForSelector('[role="alertdialog"]');
};

// ARIA: Has role="alertdialog" (NOT dialog)
test('has role="alertdialog" and required aria attributes', async ({ page }) => {
  await page.goto('patterns/alert-dialog/react/demo/');
  await openAlertDialog(page);

  const alertDialog = page.getByRole('alertdialog');
  await expect(alertDialog).toBeVisible();

  // Should NOT have role="dialog"
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toHaveCount(0);

  // aria-describedby is required (unlike Dialog)
  const describedbyId = await alertDialog.getAttribute('aria-describedby');
  expect(describedbyId).toBeTruthy();
});

// Keyboard: Escape does NOT close by default
test('Escape does NOT close dialog by default', async ({ page }) => {
  await page.goto('patterns/alert-dialog/react/demo/');
  await openAlertDialog(page);

  const alertDialog = page.getByRole('alertdialog');
  await expect(alertDialog).toBeVisible();

  await page.keyboard.press('Escape');

  // Should still be visible
  await expect(alertDialog).toBeVisible();
});

// Focus Management: Cancel button (safe action) receives initial focus
test('focuses Cancel button on open and traps focus', async ({ page }) => {
  await page.goto('patterns/alert-dialog/react/demo/');
  await openAlertDialog(page);

  const alertDialog = page.getByRole('alertdialog');
  const cancelButton = alertDialog.getByRole('button', { name: /cancel/i });

  // Initial focus on Cancel (safest action)
  await expect(cancelButton).toBeFocused();

  // Tab wraps to Confirm
  await page.keyboard.press('Tab');
  const confirmButton = alertDialog.getByRole('button').filter({ hasNot: page.getByText(/cancel/i) });
  await expect(confirmButton).toBeFocused();

  // Tab wraps back to Cancel
  await page.keyboard.press('Tab');
  await expect(cancelButton).toBeFocused();
});`,
};

// Differences from Dialog data (for AccessibilityDocs)
export const dialogVsAlertDialogDifferences = {
  en: {
    header: {
      feature: 'Feature',
      dialog: 'Dialog',
      alertDialog: 'Alert Dialog',
    },
    rows: [
      { feature: 'Role', dialog: 'dialog', alertDialog: 'alertdialog' },
      {
        feature: 'Message (aria-describedby)',
        dialog: 'Optional',
        alertDialog: 'Required',
      },
      { feature: 'Escape key', dialog: 'Enabled by default', alertDialog: 'Disabled by default' },
      {
        feature: 'Initial focus',
        dialog: 'First focusable element',
        alertDialog: 'Cancel button (safest action)',
      },
      {
        feature: 'Close button',
        dialog: 'Yes (×)',
        alertDialog: 'No (explicit response required)',
      },
      {
        feature: 'Overlay click',
        dialog: 'Closes dialog',
        alertDialog: 'Does not close (explicit response required)',
      },
    ],
  },
  ja: {
    header: {
      feature: '機能',
      dialog: 'Dialog',
      alertDialog: 'Alert Dialog',
    },
    rows: [
      { feature: 'ロール', dialog: 'dialog', alertDialog: 'alertdialog' },
      { feature: 'メッセージ（aria-describedby）', dialog: '任意', alertDialog: '必須' },
      { feature: 'Escape キー', dialog: 'デフォルトで有効', alertDialog: 'デフォルトで無効' },
      {
        feature: '初期フォーカス',
        dialog: '最初のフォーカス可能な要素',
        alertDialog: 'キャンセルボタン（最も安全なアクション）',
      },
      { feature: '閉じるボタン', dialog: 'あり（×）', alertDialog: 'なし（明示的な応答が必要）' },
      {
        feature: 'オーバーレイクリック',
        dialog: 'ダイアログを閉じる',
        alertDialog: '閉じない（明示的な応答が必要）',
      },
    ],
  },
};
