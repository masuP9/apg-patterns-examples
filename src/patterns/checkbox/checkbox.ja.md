# Checkbox Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

## 概要

チェックボックスは、セットから1つ以上のオプションを選択できます。2状態（チェック/未チェック）と親子関係のための3状態（チェック/未チェック/混在）をサポートします。

### ネイティブ vs カスタム比較

| 機能 | ネイティブ | カスタム |
| --- | --- | --- |
| 基本的なフォーム入力 | 推奨 | 不要 |
| JavaScript 無効時のサポート | ネイティブで動作 | フォールバックが必要 |
| 不確定（混在）状態 | JS プロパティのみ* | 完全に制御可能 |
| カスタムスタイリング | 制限あり（ブラウザ依存） | 完全に制御可能 |
| フォーム送信 | 組み込み | hidden input が必要 |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `checkbox` | <input type="checkbox"> または role="checkbox" を持つ要素 | 要素をチェックボックスとして識別します。ネイティブの <input type="checkbox"> はこのロールを暗黙的に持ちます。 |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-label` | Control | string | はい | アクセシブルな名前を提供 |
| `aria-labelledby` | Control | ID 参照 | はい | 外部テキストをラベルとして参照 |
| `aria-describedby` | Control | ID 参照 | いいえ | 追加の説明 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-checked / checked` | チェックボックス要素 | `true` \| `false` \| `mixed` | はい | クリック、Space キー |
| `indeterminate` | ネイティブチェックボックス（<input>） | `true` \| `false` | いいえ | 親子同期、ユーザー操作時に自動的にクリア |
| `disabled` | チェックボックス要素 | `present` \| `absent` | いいえ | プログラムによる変更 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Space` | チェックボックスの状態を切り替える（チェック/未チェック） |
| `Tab` | 次のフォーカス可能な要素にフォーカスを移動 |
| `Shift + Tab` | 前のフォーカス可能な要素にフォーカスを移動 |

## フォーカス管理

- ネイティブチェックボックス: デフォルトでフォーカス可能
- カスタム実装: tabindex="0" が必要
- 無効なチェックボックス: Tab 順序でスキップ

## テストチェックリスト

### 高優先度: ARIA

- [ ] role="checkbox" exists (implicit via native or explicit)
- [ ] Unchecked by default
- [ ] Checked when initialChecked=true
- [ ] indeterminate property settable
- [ ] Disabled state prevents interaction
- [ ] Accessible name via aria-label
- [ ] Accessible name via external <label>
- [ ] name attribute for form submission
- [ ] value attribute set correctly

### 高優先度: クリック動作

- [ ] Click toggles checked state
- [ ] User action clears indeterminate state

### 高優先度: キーボード

- [ ] Space key toggles state
- [ ] Tab moves focus to/from checkbox
- [ ] Disabled checkbox skipped by Tab
- [ ] Disabled checkbox ignores Space key

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (all states)
- [ ] State visible without color alone (WCAG 1.4.1)

## 実装ノート

## Mixed State Behavior

When a mixed (indeterminate) checkbox is activated:

```
mixed → checked (true) → unchecked (false) → checked...
```

### Parent-Child Sync (Groups)

| Children State | Parent State |
| --- | --- |
| All checked | checked |
| All unchecked | unchecked |
| Some checked | mixed |

| Parent Action | Children Effect |
| --- | --- |
| Check | All children checked |
| Uncheck | All children unchecked |
| Activate when mixed | All children checked |

## Structure

```
<span class="apg-checkbox">
  <input type="checkbox" class="apg-checkbox-input" />
  <span class="apg-checkbox-control" aria-hidden="true">
    <span class="apg-checkbox-icon--check">✓</span>
    <span class="apg-checkbox-icon--indeterminate">−</span>
  </span>
</span>
```

## Common Pitfalls

1. **Form submission**: Unchecked checkbox sends nothing (not `false`). Handle on server or use hidden input.
2. **`indeterminate` is JS-only**: No HTML attribute exists. Must set via `element.indeterminate = true`.
3. **Focus ring on custom control**: Use adjacent sibling selector since input is visually hidden.
4. **Touch target size**: WCAG 2.5.5 recommends 44x44px minimum.

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Role test
it('has role="checkbox"', () => {
  render(<Checkbox aria-label="Accept terms" />);
  expect(screen.getByRole('checkbox')).toBeInTheDocument();
});

// Toggle test
it('toggles checked state on click', async () => {
  const user = userEvent.setup();
  render(<Checkbox aria-label="Accept terms" />);

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();

  await user.click(checkbox);
  expect(checkbox).toBeChecked();
});

// Keyboard test
it('toggles on Space key', async () => {
  const user = userEvent.setup();
  render(<Checkbox aria-label="Accept terms" />);

  const checkbox = screen.getByRole('checkbox');
  checkbox.focus();

  await user.keyboard(' ');
  expect(checkbox).toBeChecked();
});

// Indeterminate test
it('clears indeterminate on user action', async () => {
  const user = userEvent.setup();
  render(<Checkbox indeterminate aria-label="Select all" />);

  const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
  expect(checkbox.indeterminate).toBe(true);

  await user.click(checkbox);
  expect(checkbox.indeterminate).toBe(false);
  expect(checkbox).toBeChecked();
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('toggles checked state on click', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-terms');
  const control = checkbox.locator('~ .apg-checkbox-control');

  await expect(checkbox).not.toBeChecked();
  await control.click();
  await expect(checkbox).toBeChecked();
});

test('Space key toggles checkbox when focused', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-terms');

  await checkbox.focus();
  await expect(checkbox).not.toBeChecked();

  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
});

test('clears indeterminate state on click', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-select-all');

  const isIndeterminate = await checkbox.evaluate(
    (el: HTMLInputElement) => el.indeterminate
  );
  expect(isIndeterminate).toBe(true);

  await checkbox.locator('~ .apg-checkbox-control').click();

  const isIndeterminateAfter = await checkbox.evaluate(
    (el: HTMLInputElement) => el.indeterminate
  );
  expect(isIndeterminateAfter).toBe(false);
  await expect(checkbox).toBeChecked();
});
```
