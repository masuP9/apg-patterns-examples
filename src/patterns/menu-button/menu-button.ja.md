# Menu Button Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

## 概要

メニューボタンは、メニューを開くボタンです。ボタン要素はaria-haspopup="menu"を持ち、メニュー項目を含むドロップダウンメニューを制御します。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `button` | トリガー（<button>） | メニューを開くトリガー（<button>要素による暗黙的なロール） |
| `menu` | コンテナ（<ul>） | ユーザーに選択肢のリストを提供するウィジェット |
| `menuitem` | 各アイテム（<li>） | メニュー内のオプション |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-haspopup` | button | "menu" | はい | ボタンがメニューを開くことを示す |
| `aria-controls` | button | ID参照 | いいえ | メニュー要素を参照する |
| `aria-labelledby` | menu | ID参照 | はい | メニューを開くボタンを参照する |
| `aria-label` | menu | 文字列 | はい | メニューのアクセシブルな名前を提供する |
| `aria-disabled` | menuitem | true | いいえ | メニューアイテムが無効であることを示す |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-expanded` | button | `true` \| `false` | はい | メニューを開く/閉じる |

## キーボードサポート

### ボタン（メニューが閉じている状態）

| キー | アクション |
| --- | --- |
| `Enter / Space` | メニューを開き、最初のアイテムにフォーカスを移動する |
| `Down Arrow` | メニューを開き、最初のアイテムにフォーカスを移動する |
| `Up Arrow` | メニューを開き、最後のアイテムにフォーカスを移動する |

### メニュー（開いている状態）

| キー | アクション |
| --- | --- |
| `Down Arrow` | 次のアイテムにフォーカスを移動する（最後の項目から最初にラップする） |
| `Up Arrow` | 前のアイテムにフォーカスを移動する（最初の項目から最後にラップする） |
| `Home` | 最初のアイテムにフォーカスを移動する |
| `End` | 最後のアイテムにフォーカスを移動する |
| `Escape` | メニューを閉じ、フォーカスをボタンに戻す |
| `Tab` | メニューを閉じ、次のフォーカス可能な要素にフォーカスを移動する |
| `Enter / Space` | フォーカスされたアイテムを実行し、メニューを閉じる |
| `Type character` | 先行入力: 入力された文字で始まるアイテムにフォーカスを移動する |

## フォーカス管理

- フォーカスされたメニューアイテム: tabIndex="0"
- その他のメニューアイテム: tabIndex="-1"
- 矢印キーナビゲーション: 最後から最初へ、またはその逆にラップする
- 無効なアイテム: ナビゲーション中にスキップされる
- メニューが閉じる: フォーカスがボタンに戻る

## テストチェックリスト

### 高優先度: クリック動作

- [ ] Click button opens menu
- [ ] Click button again closes menu (toggle)
- [ ] Click menu item activates and closes menu
- [ ] Click disabled item does nothing
- [ ] Click outside menu closes it

### 高優先度: キーボード

- [ ] Enter opens menu, focuses first enabled item
- [ ] Space opens menu, focuses first enabled item
- [ ] ArrowDown opens menu, focuses first enabled item
- [ ] ArrowUp opens menu, focuses last enabled item
- [ ] ArrowDown moves to next item (wraps)
- [ ] ArrowUp moves to previous item (wraps)
- [ ] Home moves to first enabled item
- [ ] End moves to last enabled item
- [ ] Escape closes menu, returns focus to button
- [ ] Tab closes menu
- [ ] Enter/Space activates item, closes menu
- [ ] Disabled items are skipped
- [ ] Single character focuses matching item
- [ ] Multiple characters match prefix
- [ ] Search wraps around
- [ ] Buffer resets after 500ms

### 高優先度: ARIA

- [ ] Button has role="button"
- [ ] Button has aria-haspopup="menu"
- [ ] Button has aria-expanded (true/false)
- [ ] Button has aria-controls linking to menu
- [ ] Menu has role="menu"
- [ ] Menu has accessible name
- [ ] Items have role="menuitem"
- [ ] Disabled items have aria-disabled="true"

### 高優先度: フォーカス管理

- [ ] Only focused item has tabIndex="0"
- [ ] Other items have tabIndex="-1"

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Structure

```html
Structure (closed):
<button
  aria-haspopup="menu"
  aria-expanded="false"
  aria-controls="menu-id"
>
  Actions ▼
</button>
<ul id="menu-id" role="menu" aria-labelledby="button-id" hidden>
  <li role="menuitem" tabindex="-1">Cut</li>
  <li role="menuitem" tabindex="-1">Copy</li>
  <li role="menuitem" tabindex="-1">Paste</li>
</ul>

Structure (open):
<button
  aria-haspopup="menu"
  aria-expanded="true"
  aria-controls="menu-id"
>
  Actions ▼
</button>
<ul id="menu-id" role="menu" aria-labelledby="button-id">
  <li role="menuitem" tabindex="0">Cut</li>      <!-- focused -->
  <li role="menuitem" tabindex="-1">Copy</li>
  <li role="menuitem" tabindex="-1">Paste</li>
</ul>

With disabled item:
<li role="menuitem" aria-disabled="true" tabindex="-1">Export</li>
```

## Type-Ahead Search

- Characters typed within 500ms form search string
- After 500ms idle, buffer resets
- Search is case-insensitive
- Wraps from end to beginning

## Focus Management (Roving Tabindex)

- Only one menu item has `tabIndex="0"`
- Other items have `tabIndex="-1"`
- Disabled items are skipped during keyboard navigation
- Focus wraps from last to first (and vice versa)

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Open menu with Enter
it('Enter opens menu and focuses first item', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" />);

  const button = screen.getByRole('button', { name: 'Actions' });
  button.focus();

  await user.keyboard('{Enter}');

  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
});

// Arrow navigation with wrap
it('ArrowDown wraps from last to first', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  screen.getByRole('menuitem', { name: 'Delete' }).focus(); // last item

  await user.keyboard('{ArrowDown}');

  expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
});

// Escape closes menu
it('Escape closes menu and returns focus to button', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  const button = screen.getByRole('button');

  await user.keyboard('{Escape}');

  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(button).toHaveFocus();
});

// Type-ahead
it('type-ahead focuses matching item', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  screen.getByRole('menuitem', { name: 'Cut' }).focus();

  await user.keyboard('p');

  expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
});

// Click outside closes menu
it('clicking outside closes menu', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  await user.click(document.body);

  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

// Helper functions
const getMenuButton = (page) => page.getByRole('button', { name: /actions/i }).first();
const getMenu = (page) => page.getByRole('menu');
const getMenuItems = (page) => page.getByRole('menuitem');

const openMenu = async (page) => {
  const button = getMenuButton(page);
  await button.click();
  await getMenu(page).waitFor({ state: 'visible' });
  return button;
};

// ARIA structure tests
test('button has correct ARIA attributes', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  const button = getMenuButton(page);

  await expect(button).toHaveAttribute('aria-haspopup', 'menu');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toHaveAttribute('aria-controls', /.+/);
});

// Keyboard interaction
test('Enter opens menu and focuses first item', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  const button = getMenuButton(page);
  await button.focus();
  await page.keyboard.press('Enter');

  await expect(getMenu(page)).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(getMenuItems(page).first()).toBeFocused();
});

// Type-ahead (use trim() for frameworks with whitespace in textContent)
test('type-ahead focuses matching item', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  await openMenu(page);
  await expect(getMenuItems(page).first()).toBeFocused();

  await page.keyboard.press('p');

  await expect
    .poll(async () => {
      const text = await page.evaluate(
        () => document.activeElement?.textContent?.trim().toLowerCase() || ''
      );
      return text.startsWith('p');
    })
    .toBe(true);
});

// axe-core accessibility
test('no accessibility violations', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  await openMenu(page);

  const results = await new AxeBuilder({ page })
    .include('.apg-menu-button')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```
