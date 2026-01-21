# Button Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/button/

## 概要

ボタンは、フォームの送信、ダイアログを開く、アクションのキャンセル、削除操作の実行など、アクションやイベントをトリガーするためのウィジェットです。

## ネイティブHTML vs カスタム実装

| ユースケース | 推奨 |
| --- | --- |
| Simple action button | Native <button> |
| Form submission | Native <button type="submit"> |
| Educational purposes (demonstrating ARIA) | Custom role="button" |
| Legacy constraints (non-button must act as button) | Custom role="button" |

### ネイティブ vs カスタム比較

| 機能 | ネイティブ | カスタム |
| --- | --- | --- |
| Keyboard activation (Space/Enter) | Built-in | Requires JavaScript |
| Focus management | Automatic | Requires tabindex |
| disabled attribute | Built-in | Requires aria-disabled + JS |
| Form submission | Built-in | Not supported |
| type attribute | submit/button/reset | Not supported |
| Works without JavaScript | Yes | No |
| Screen reader announcement | Automatic | Requires ARIA |
| Space key scroll prevention | Automatic | Requires preventDefault() |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `button` | <button> または role="button" を持つ要素 | 要素をボタンウィジェットとして識別します。ネイティブの <code>&lt;button&gt;</code> は暗黙的にこのロールを持ちます。 |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `tabindex` | [object Object] | `"0"` \| `"-1"` | はい | カスタムボタン要素をキーボードナビゲーションでフォーカス可能にします。ネイティブの <code>&lt;button&gt;</code> はデフォルトでフォーカス可能です。無効時は -1 に設定します。 |
| `aria-disabled` | [object Object] | `"true"` \| `"false"` | はい | ボタンがインタラクティブでなく、アクティブ化できないことを示します。ネイティブの <code>&lt;button disabled&gt;</code> はこれを自動的に処理します。 |
| `aria-label` | [object Object] | アクションを説明するテキスト文字列 | はい | アイコンのみのボタンや、表示テキストが不十分な場合にアクセシブルな名前を提供します。 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Space` | ボタンをアクティブ化 |
| `Enter` | ボタンをアクティブ化 |
| `Tab` | 次のフォーカス可能な要素にフォーカスを移動 |
| `Shift + Tab` | 前のフォーカス可能な要素にフォーカスを移動 |

## フォーカス管理

- フォーカスリング: キーボードでフォーカスされた際に表示されるアウトライン
- カーソルスタイル: インタラクティブであることを示すポインターカーソル
- 無効時の外観: 無効時は不透明度を下げ、not-allowedカーソルを表示

## テストチェックリスト

### 高優先度: キーボード

- [ ] Space key activates the button
- [ ] Enter key activates the button
- [ ] Space key prevents page scrolling
- [ ] Tab moves focus to next button
- [ ] Disabled buttons skip Tab order

### 高優先度: ARIA

- [ ] Element has role="button"
- [ ] Element has tabindex="0"
- [ ] Disabled button has aria-disabled="true"
- [ ] Disabled button has tabindex="-1"

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

### 中優先度: クリック動作

- [ ] Disabled buttons ignore click events
- [ ] Disabled buttons ignore keyboard events

## 実装ノート

Structure (custom implementation):
<span
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeydown="handleKeydown(event)"
>
  Click me
</span>

Native (recommended):
<button type="button">Click me</button>

Key points:
- tabindex="0" makes element focusable
- Both Space and Enter must activate the button
- Space key must call preventDefault() to prevent scrolling
- Disabled state: aria-disabled="true" + tabindex="-1"
- IME composition must be handled (check event.isComposing)

Button vs Toggle Button:
This pattern is for simple action buttons.
For buttons that toggle between pressed and unpressed states,
see the Toggle Button pattern which uses aria-pressed.

## テストコード例 (React + Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

// Button role
it('has button role', () => {
  render(<CustomButton onClick={jest.fn()}>Click</CustomButton>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

// Keyboard activation
it('activates on Space key', () => {
  const handleClick = jest.fn();
  render(<CustomButton onClick={handleClick}>Click</CustomButton>);
  fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
  expect(handleClick).toHaveBeenCalled();
});

it('activates on Enter key', () => {
  const handleClick = jest.fn();
  render(<CustomButton onClick={handleClick}>Click</CustomButton>);
  fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
});

// Disabled state
it('has aria-disabled when disabled', () => {
  render(<CustomButton disabled>Click</CustomButton>);
  expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Helper to get custom button
const getButton = (page) => {
  return page.locator('[role="button"]').first();
};

// Keyboard activation
test('activates on Space key', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const button = getButton(page);
  await button.focus();
  await button.press('Space');

  // Verify activation (depends on implementation)
  await expect(page.locator('.result')).toContainText('clicked');
});

test('activates on Enter key', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const button = getButton(page);
  await button.focus();
  await button.press('Enter');

  // Verify activation
  await expect(page.locator('.result')).toContainText('clicked');
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const results = await new AxeBuilder({ page })
    .include('[role="button"]')
    .analyze();

  expect(results.violations).toEqual([]);
});
```
