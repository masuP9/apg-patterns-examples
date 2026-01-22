# Listbox Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

## 概要

リストボックスウィジェットは、オプションのリストを表示し、1つまたは複数のアイテムの選択を可能にします。ネイティブの `<select>` を超えたカスタム選択動作を提供します。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `listbox` | コンテナ（`<ul>`） | リストから1つまたは複数のアイテムを選択するためのウィジェット |
| `option` | 各アイテム（`<li>`） | リストボックス内の選択可能なオプション |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-label` | listbox | String | はい | リストボックスのアクセシブル名 |
| `aria-labelledby` | listbox | ID reference | はい | ラベル要素への参照 |
| `aria-multiselectable` | listbox | `true` | いいえ | 複数選択モードを有効にする |
| `aria-orientation` | listbox | ``"vertical"`` \| ``"horizontal"`` | いいえ | ナビゲーションの方向（デフォルト: vertical） |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-selected` | option | ``true`` \| ``false`` | はい | クリック、矢印キー（単一選択）、Space（複数選択） |
| `aria-disabled` | option | `true` | いいえ | 無効時のみ |

## キーボードサポート

### 共通ナビゲーション

| キー | アクション |
| --- | --- |
| `Down Arrow / Up Arrow` | フォーカスを移動（垂直方向） |
| `Right Arrow / Left Arrow` | フォーカスを移動（水平方向） |
| `Home` | 最初のオプションにフォーカスを移動 |
| `End` | 最後のオプションにフォーカスを移動 |
| `Type character` | 先行入力: 入力した文字で始まるオプションにフォーカス |

### 単一選択（選択がフォーカスに追従）

| キー | アクション |
| --- | --- |
| `Arrow keys` | フォーカスと選択を同時に移動 |
| `Space / Enter` | 現在の選択を確定 |

### 複数選択

| キー | アクション |
| --- | --- |
| `Arrow keys` | フォーカスのみ移動（選択は変更なし） |
| `Space` | フォーカス中のオプションの選択をトグル |
| `Shift + Arrow` | フォーカスを移動し選択範囲を拡張 |
| `Shift + Home` | アンカーから最初のオプションまで選択 |
| `Shift + End` | アンカーから最後のオプションまで選択 |
| `Ctrl + A` | すべてのオプションを選択 |

## フォーカス管理

- フォーカス中のオプション: 常に1つのオプションのみが `tabindex="0"` を持つ（ローヴィングタブインデックス）
- フォーカスされていないオプション: 他のオプションは `tabindex="-1"` を持つ
- 矢印ナビゲーション: 矢印キーでオプション間のフォーカスを移動
- 無効化されたオプション: 無効化されたオプションはナビゲーション中にスキップされる
- 端の動作: フォーカスは端で折り返さない（端で停止）

## テストチェックリスト

### 高優先度: キーボード

- [ ] Arrow keys navigate options
- [ ] Home moves to first option
- [ ] End moves to last option
- [ ] Type-ahead focuses matching option
- [ ] Disabled options are skipped
- [ ] Focus does not wrap
- [ ] Arrow keys move focus and selection (single-select)
- [ ] Space/Enter confirms selection
- [ ] Arrow keys move focus only (multi-select)
- [ ] Space toggles selection
- [ ] Shift+Arrow extends selection
- [ ] Ctrl+A selects all

### 高優先度: ARIA

- [ ] Container has `role="listbox"`
- [ ] Items have `role="option"`
- [ ] Listbox has accessible name
- [ ] Selected options have `aria-selected="true"`
- [ ] Multi-select has `aria-multiselectable="true"`

### 高優先度: フォーカス管理

- [ ] Only focused option has `tabIndex="0"`
- [ ] Other options have `tabIndex="-1"`

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

Structure:
```html
<ul role="listbox" aria-label="Choose color">
  <li role="option" aria-selected="true" tabindex="0">Red</li>
  <li role="option" aria-selected="false" tabindex="-1">Green</li>
  <li role="option" aria-selected="false" tabindex="-1">Blue</li>
</ul>
```

Multi-Select:
```html
<ul role="listbox" aria-label="Colors" aria-multiselectable="true">
  <li role="option" aria-selected="true" tabindex="0">Red</li>
  <li role="option" aria-selected="true" tabindex="-1">Green</li>
  <li role="option" aria-selected="false" tabindex="-1">Blue</li>
</ul>
```

Type-Ahead:
- Single character: jump to next option starting with that char
- Multiple chars (typed quickly): match prefix
- Example: typing "gr" focuses "Green"

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Arrow navigation
it('ArrowDown moves focus', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  const firstOption = screen.getByRole('option', { name: 'Red' });
  firstOption.focus();

  await user.keyboard('{ArrowDown}');

  expect(screen.getByRole('option', { name: 'Green' })).toHaveFocus();
});

// Single-select
it('selection follows focus in single-select', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  const firstOption = screen.getByRole('option', { name: 'Red' });
  firstOption.focus();

  await user.keyboard('{ArrowDown}');

  const greenOption = screen.getByRole('option', { name: 'Green' });
  expect(greenOption).toHaveAttribute('aria-selected', 'true');
});

// Multi-select toggle
it('Space toggles in multi-select', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} multiselectable />);

  const option = screen.getByRole('option', { name: 'Red' });
  option.focus();

  await user.keyboard(' ');
  expect(option).toHaveAttribute('aria-selected', 'true');

  await user.keyboard(' ');
  expect(option).toHaveAttribute('aria-selected', 'false');
});

// Type-ahead
it('type-ahead focuses matching option', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  screen.getByRole('option', { name: 'Red' }).focus();

  await user.keyboard('g');

  expect(screen.getByRole('option', { name: 'Green' })).toHaveFocus();
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/listbox/react/demo/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').first();
  await expect(listbox).toHaveAttribute('role', 'listbox');

  // Check accessible name
  const ariaLabelledby = await listbox.getAttribute('aria-labelledby');
  expect(ariaLabelledby).toBeTruthy();

  // Check options have correct role
  const options = listbox.locator('[role="option"]');
  const count = await options.count();
  expect(count).toBeGreaterThan(0);

  // Multi-select listbox has aria-multiselectable
  const multiSelectListbox = page.locator('[role="listbox"]').nth(1);
  await expect(multiSelectListbox).toHaveAttribute('aria-multiselectable', 'true');
});

// Keyboard navigation test (single-select)
test('ArrowDown moves focus and selection in single-select', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').first();
  const options = listbox.locator('[role="option"]:not([aria-disabled="true"])');
  const firstOption = options.first();
  const secondOption = options.nth(1);

  await firstOption.focus();
  await expect(firstOption).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('ArrowDown');
  await expect(secondOption).toHaveAttribute('tabindex', '0');
  await expect(secondOption).toHaveAttribute('aria-selected', 'true');
  await expect(firstOption).toHaveAttribute('aria-selected', 'false');
});

// Multi-select keyboard test
test('Space toggles selection in multi-select', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').nth(1);
  const firstOption = listbox.locator('[role="option"]:not([aria-disabled="true"])').first();

  await firstOption.focus();
  await expect(firstOption).not.toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Space');
  await expect(firstOption).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Space');
  await expect(firstOption).toHaveAttribute('aria-selected', 'false');
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).include('[role="listbox"]').analyze();
  expect(results.violations).toEqual([]);
});
```
