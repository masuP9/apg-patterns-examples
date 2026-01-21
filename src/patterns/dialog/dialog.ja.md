# Dialog Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

## 概要

ダイアログはプライマリコンテンツ上に表示されるウィンドウで、ユーザーの操作を必要とします。モーダルダイアログはフォーカスをトラップし、ダイアログ外のコンテンツとの操作を防ぎます。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `dialog` | ダイアログコンテナ | その要素がダイアログウィンドウであることを示す (required) |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-modal` | dialog | true | はい | これがモーダルダイアログであることを示す |
| `aria-labelledby` | dialog | タイトル要素への ID 参照 | はい | ダイアログのタイトルを参照する |
| `aria-describedby` | dialog | 説明への ID 参照 | いいえ | オプションの説明テキストを参照する |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | ダイアログ内の次のフォーカス可能な要素にフォーカスを移動する。最後の要素にフォーカスがある場合は最初の要素に移動する。 |
| `Shift + Tab` | ダイアログ内の前のフォーカス可能な要素にフォーカスを移動する。最初の要素にフォーカスがある場合は最後の要素に移動する。 |
| `Escape` | ダイアログを閉じて、開いた要素にフォーカスを戻す |

## フォーカス管理

- ダイアログが開く: ダイアログ内の最初のフォーカス可能な要素にフォーカスが移動する
- ダイアログが閉じる: ダイアログを開いた要素にフォーカスが戻る
- フォーカストラップ: Tab/Shift+Tab はダイアログ内のフォーカス可能な要素間のみをサイクルする
- 背景: ダイアログ外のコンテンツは不活性化される（フォーカス不可・操作不可）

## テストチェックリスト

### 高優先度: キーボード

- [ ] Escape closes the dialog
- [ ] Tab moves to next focusable element
- [ ] Shift+Tab moves to previous focusable element
- [ ] Tab wraps from last to first element
- [ ] Shift+Tab wraps from first to last element

### 高優先度: ARIA

- [ ] Container has role="dialog"
- [ ] Dialog has aria-modal="true"
- [ ] Dialog has aria-labelledby referencing title
- [ ] Title element id matches aria-labelledby value

### 高優先度: フォーカス管理

- [ ] Focus moves into dialog on open
- [ ] Focus returns to trigger on close
- [ ] Focus is trapped within dialog
- [ ] Background content is inert

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] Page scrolling is disabled while open
- [ ] Close button has accessible label

## 実装ノート

## Structure

```
+-------------------------------------+
| Dialog Title          [X]           |  <- aria-labelledby target
+-------------------------------------+
|                                     |
| Dialog content...                   |  <- aria-describedby target (optional)
|                                     |
| [Cancel]  [Confirm]                 |  <- focusable elements
+-------------------------------------+
```

## Focus Trap

- First focusable -> ... -> Last focusable -> First focusable (loop)
- Store trigger element reference before opening
- Restore focus to trigger on close

## Native Dialog Element

When using native `<dialog>` element with `showModal()`:
- Modal behavior is implicit
- `aria-modal` may be omitted
- Browser handles focus trapping automatically

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Focus trap test
it('traps focus within dialog', async () => {
  const user = userEvent.setup();
  render(<Dialog open />);

  const closeButton = screen.getByRole('button', { name: /close/i });
  const confirmButton = screen.getByRole('button', { name: /confirm/i });

  closeButton.focus();
  await user.tab();
  // Focus should cycle within dialog
});

// Escape closes dialog
it('closes on Escape', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(<Dialog open onClose={onClose} />);

  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});

// Focus restoration
it('returns focus to trigger on close', async () => {
  const user = userEvent.setup();
  render(<DialogWithTrigger />);

  const trigger = screen.getByRole('button', { name: /open/i });
  await user.click(trigger);
  await user.keyboard('{Escape}');

  expect(trigger).toHaveFocus();
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

const getDialog = (page: import('@playwright/test').Page) => {
  return page.getByRole('dialog');
};

const openDialog = async (page: import('@playwright/test').Page) => {
  const trigger = page.getByRole('button', { name: /open dialog/i }).first();
  await trigger.click();
  await getDialog(page).waitFor({ state: 'visible' });
  return trigger;
};

// ARIA structure test
test('has role="dialog"', async ({ page }) => {
  await openDialog(page);
  const dialog = getDialog(page);
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveRole('dialog');
});

// Focus trap test
test('traps focus within dialog', async ({ page }) => {
  await openDialog(page);
  const dialog = getDialog(page);
  const focusableElements = dialog.locator(
    'button:not([disabled]), [tabindex="0"], input:not([disabled])'
  );
  const count = await focusableElements.count();
  const tabCount = Math.max(count * 3, 10);

  for (let i = 0; i < tabCount; i++) {
    await page.keyboard.press('Tab');
  }

  // Focus should still be within dialog
  const isWithinDialog = await page.evaluate(() => {
    const focused = document.activeElement;
    return focused?.closest('dialog, [role="dialog"]') !== null;
  });
  expect(isWithinDialog).toBe(true);
});

// Focus restoration test
test('returns focus to trigger on close', async ({ page }) => {
  const trigger = await openDialog(page);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
```
