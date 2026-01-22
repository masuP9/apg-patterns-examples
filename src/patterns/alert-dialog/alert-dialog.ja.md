# Alert Dialog Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

## 概要

アラートダイアログは、ユーザーのワークフローを中断して重要なメッセージを伝え、応答を求めるモーダルダイアログです。通常のダイアログとは異なり、role="alertdialog" を使用し、支援技術でシステムのアラート音がトリガーされる場合があります。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `alertdialog` | ダイアログコンテナ | ユーザーのワークフローを中断して重要なメッセージを伝え、応答を求めるダイアログの一種。支援技術でシステムのアラート音がトリガーされる場合があります。 |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-modal` | alertdialog | true | はい | showModal() によって自動的に提供される。ネイティブの <dialog> 要素使用時は明示的な属性は不要。 |
| `aria-labelledby` | alertdialog | タイトル要素への ID 参照 | はい | アラートダイアログのタイトルを参照する |
| `aria-describedby` | alertdialog | メッセージへの ID 参照 | はい | アラートメッセージを参照する。通常の Dialog とは異なり、Alert Dialog ではメッセージがユーザーの意思決定を理解する上で中心的であるため、この属性は必須です。 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | ダイアログ内の次のフォーカス可能な要素にフォーカスを移動する。最後の要素にフォーカスがある場合は最初の要素に移動する。 |
| `Shift + Tab` | ダイアログ内の前のフォーカス可能な要素にフォーカスを移動する。最初の要素にフォーカスがある場合は最後の要素に移動する。 |
| `Escape` | デフォルトでは無効。通常の Dialog とは異なり、アラートダイアログではユーザーに明示的に応答させるため、Escape キーによる閉じる動作を防止します。allowEscapeClose プロパティで重要度の低いアラートに対して有効にすることができます。 |
| `Enter` | フォーカスされているボタンを実行する |
| `Space` | フォーカスされているボタンを実行する |

## フォーカス管理

- ダイアログが開く: フォーカスはキャンセルボタン（最も安全なアクション）に移動する。これは最初のフォーカス可能な要素にフォーカスする通常の Dialog とは異なります。
- ダイアログが閉じる: ダイアログを開いた要素にフォーカスが戻る
- フォーカストラップ: Tab/Shift+Tab はダイアログ内のフォーカス可能な要素間のみをサイクルする
- 背景: ダイアログ外のコンテンツは不活性化される（フォーカス不可・操作不可）

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="alertdialog" (NOT dialog)
- [ ] Is modal (opened via showModal(), confirmed by ::backdrop existence)
- [ ] Has aria-labelledby referencing title element
- [ ] Has aria-describedby referencing message element (required)
- [ ] Title element id matches aria-labelledby value
- [ ] Message element id matches aria-describedby value

### 高優先度: キーボード

- [ ] Tab moves to next focusable element
- [ ] Shift+Tab moves to previous focusable element
- [ ] Tab wraps from last to first element
- [ ] Shift+Tab wraps from first to last element
- [ ] Escape does NOT close when allowEscapeClose=false
- [ ] Escape closes when allowEscapeClose=true
- [ ] Enter activates focused button
- [ ] Space activates focused button

### 高優先度: フォーカス管理

- [ ] Focus moves to Cancel button on open (safest action)
- [ ] Focus is trapped within dialog
- [ ] Focus returns to trigger on close (E2E only - jsdom limitation)
- [ ] Background content is inert

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

Structure (uses native <dialog> element):
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
- aria-describedby is REQUIRED (message prop required)

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
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
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

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
});
```
