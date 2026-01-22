# Combobox Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

## 概要

コンボボックスはテキスト入力フィールドと関連するポップアップ（リストボックス）を持つ複合ウィジェットです。ユーザーは値を入力するか、ポップアップから選択できます。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `combobox` | Input (`<input>`) | ユーザーが入力するテキスト入力要素 |
| `listbox` | Popup (`<ul>`) | 選択可能なオプションを含むポップアップ |
| `option` | Each item (`<li>`) | 個々の選択可能なオプション |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `role="combobox"` | input | - | はい | 入力をコンボボックスとして識別 |
| `aria-controls` | input | ID reference | はい | リストボックスポップアップを参照（閉じている時も） |
| `aria-expanded` | input | ``true`` \| ``false`` | はい | ポップアップが開いているかどうかを示す |
| `aria-autocomplete` | input | ``list`` \| ``none`` \| ``both`` | はい | オートコンプリートの動作を説明 |
| `aria-activedescendant` | input | `ID reference` \| `empty` | はい | ポップアップ内で現在フォーカスされているオプションを参照 |
| `aria-labelledby` | [object Object] | ID reference | はい | ラベル要素を参照 |
| `aria-selected` | option | ``true`` \| ``false`` | はい | 現在フォーカスされているオプションを示す |
| `aria-disabled` | option | `true` | いいえ | オプションが無効であることを示す |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Down Arrow` | ポップアップを開き、最初のオプションにフォーカス |
| `Up Arrow` | ポップアップを開き、最後のオプションにフォーカス |
| `Alt + Down Arrow` | フォーカス位置を変更せずにポップアップを開く |
| `[object Object]` | オプションをフィルタリングしてポップアップを開く |
| `Down Arrow` | 次の有効なオプションにフォーカスを移動（折り返しなし） |
| `Up Arrow` | 前の有効なオプションにフォーカスを移動（折り返しなし） |
| `Home` | 最初の有効なオプションにフォーカスを移動 |
| `End` | 最後の有効なオプションにフォーカスを移動 |
| `Enter` | フォーカス中のオプションを選択しポップアップを閉じる |
| `Escape` | ポップアップを閉じ、以前の入力値を復元 |
| `Alt + Up Arrow` | フォーカス中のオプションを選択しポップアップを閉じる |
| `Tab` | ポップアップを閉じ、次のフォーカス可能な要素に移動 |

## フォーカス管理

- 矢印キーでナビゲーション: DOMフォーカスはinputに留まり、aria-activedescendantが視覚的にフォーカスされているオプションを参照
- ポップアップが閉じるかフィルタ結果が空: aria-activedescendantがクリアされる
- 無効なオプションに遭遇: ナビゲーション中に無効なオプションはスキップされる

## テストチェックリスト

### 高優先度: ARIA

- [ ] Input has `role="combobox"`
- [ ] Input has `aria-controls` pointing to listbox
- [ ] `aria-controls` valid even when popup closed
- [ ] `aria-expanded` toggles correctly
- [ ] `aria-autocomplete="list"` present
- [ ] `aria-activedescendant` updates on navigation
- [ ] `aria-activedescendant` clears when closed/empty
- [ ] Listbox has `role="listbox"` and `hidden` when closed
- [ ] Options have `role="option"` and `aria-selected`

### 高優先度: キーボード

- [ ] ArrowDown opens popup, focuses first
- [ ] ArrowUp opens popup, focuses last
- [ ] ArrowDown/Up navigates options
- [ ] Home/End jump to first/last
- [ ] Enter commits selection
- [ ] Escape closes and restores value
- [ ] Tab closes popup

### 高優先度: フォーカス管理

- [ ] DOM focus remains on input during navigation
- [ ] Disabled options are skipped

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

Structure Diagram:
```
Container (div)
+-- Label (label) id="combobox-label"
+-- Input (input)
|   role="combobox"
|   aria-controls="listbox-id"
|   aria-expanded="true/false"
|   aria-autocomplete="list"
|   aria-activedescendant="option-id" (or "")
|   aria-labelledby="combobox-label"
+-- Listbox (ul) id="listbox-id" hidden={!isOpen}
    role="listbox"
    +-- Option (li) role="option" id="opt-1" aria-selected
    +-- Option (li) role="option" id="opt-2" aria-disabled
```

Key Points:
- Listbox always in DOM: Keep listbox in DOM with hidden attribute when closed
- DOM focus stays on input at all times
- Use aria-activedescendant for virtual focus in listbox
- Clear aria-activedescendant when popup closes or filter results are empty
- Skip disabled options during navigation

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry', disabled: true },
];

// ARIA structure
it('has correct ARIA attributes', () => {
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(input).toHaveAttribute('aria-autocomplete', 'list');
  expect(input).toHaveAttribute('aria-controls');
});

// Keyboard - opens popup on ArrowDown
it('opens popup on ArrowDown and focuses first option', async () => {
  const user = userEvent.setup();
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  await user.click(input);
  await user.keyboard('{ArrowDown}');

  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(input).toHaveAttribute('aria-activedescendant', 'apple');
});

// Focus - skips disabled options
it('skips disabled options', async () => {
  const user = userEvent.setup();
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  await user.click(input);
  await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

  expect(input).toHaveAttribute('aria-activedescendant', 'banana');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  const combobox = page.locator('[role="combobox"]').first();

  await expect(combobox).toHaveAttribute('role', 'combobox');
  const ariaControls = await combobox.getAttribute('aria-controls');
  expect(ariaControls).toBeTruthy();

  const listbox = page.locator(`#${ariaControls}`);
  await expect(listbox).toHaveAttribute('role', 'listbox');
});

// Keyboard - opens popup
test('ArrowDown opens popup and focuses first option', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  const combobox = page.locator('[role="combobox"]').first();

  await combobox.click();
  await page.keyboard.press('Escape');
  await expect(combobox).toHaveAttribute('aria-expanded', 'false');

  await page.keyboard.press('ArrowDown');
  await expect(combobox).toHaveAttribute('aria-expanded', 'true');

  const activeDescendant = await combobox.getAttribute('aria-activedescendant');
  expect(activeDescendant).toBeTruthy();
});

// axe-core test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  await page.locator('[role="combobox"]').first().waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.apg-combobox')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
