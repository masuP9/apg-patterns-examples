# Menubar Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

## 概要

メニューバーは、アプリケーションスタイルのナビゲーションを提供する水平メニューバーです。各メニューバーアイテムはドロップダウンメニューやサブメニューを開くことができます。Menu-Buttonとは異なり、メニューバーは常に表示され、階層的なナビゲーション、チェックボックス/ラジオアイテム、ホバーによるメニュー切り替えをサポートします。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `menubar` | 水平コンテナ（<ul>） | トップレベルのメニューバー（常に表示） |
| `menu` | 垂直コンテナ（<ul>） | ドロップダウンメニューまたはサブメニュー |
| `menuitem` | アイテム（<span>） | 標準的なアクションアイテム |
| `menuitemcheckbox` | チェックボックスアイテム | トグル可能なオプション |
| `menuitemradio` | ラジオアイテム | グループ内の排他的なオプション |
| `separator` | 区切り線（<hr>） | 視覚的な区切り（フォーカス不可） |
| `group` | グループコンテナ | ラジオアイテムをラベル付きでグループ化 |
| `none` | <li> elements | スクリーンリーダーからリストセマンティクスを隠す |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-haspopup` | [object Object] | "menu" | はい | アイテムがメニューを開くことを示す（"true"ではなく"menu"を使用） |
| `aria-expanded` | [object Object] | `true` \| `false` | はい | メニューが開いているかどうかを示す |
| `aria-labelledby` | menu | ID参照 | はい | 親のmenuitemを参照する |
| `aria-label` | menubar/menu | 文字列 | はい | アクセシブルな名前を提供する |
| `aria-checked` | checkbox/radio | `true` \| `false` | はい | チェック状態を示す |
| `aria-disabled` | menuitem | true | はい | アイテムが無効であることを示す |
| `aria-hidden` | menu/submenu | `true` \| `false` | はい | 閉じているときメニューをスクリーンリーダーから隠す |

## キーボードサポート

### メニューバーナビゲーション

| キー | アクション |
| --- | --- |
| `Right Arrow` | 次のメニューバーアイテムにフォーカスを移動（最後から最初にラップ） |
| `Left Arrow` | 前のメニューバーアイテムにフォーカスを移動（最初から最後にラップ） |
| `Down Arrow` | サブメニューを開き、最初のアイテムにフォーカス |
| `Up Arrow` | サブメニューを開き、最後のアイテムにフォーカス |
| `Enter / Space` | サブメニューを開き、最初のアイテムにフォーカス |
| `Home` | 最初のメニューバーアイテムにフォーカスを移動 |
| `End` | 最後のメニューバーアイテムにフォーカスを移動 |
| `Tab` | すべてのメニューを閉じてフォーカスを外に移動 |

### メニュー/サブメニューナビゲーション

| キー | アクション |
| --- | --- |
| `Down Arrow` | 次のアイテムにフォーカスを移動（最後から最初にラップ） |
| `Up Arrow` | 前のアイテムにフォーカスを移動（最初から最後にラップ） |
| `Right Arrow` | サブメニューがあれば開く、またはトップレベルメニューでは次のメニューバーアイテムのメニューに移動 |
| `Left Arrow` | サブメニューを閉じて親に戻る、またはトップレベルメニューでは前のメニューバーアイテムのメニューに移動 |
| `Enter / Space` | アイテムを実行してメニューを閉じる；チェックボックス/ラジオは状態を切り替えてメニューを開いたままにする |
| `Escape` | メニューを閉じてフォーカスを親（メニューバーアイテムまたは親menuitem）に戻す |
| `Home` | 最初のアイテムにフォーカスを移動 |
| `End` | 最後のアイテムにフォーカスを移動 |
| `Character` | 先行入力: 入力された文字で始まるアイテムにフォーカスを移動 |

## フォーカス管理

- 初期フォーカス: 一度に1つのメニューバーアイテムのみがtabindex="0"を持つ
- その他のアイテム: その他のアイテムはtabindex="-1"を持つ
- 矢印キーナビゲーション: 矢印キーでアイテム間のフォーカス移動（ラップあり）
- 無効なアイテム: 無効なアイテムはフォーカス可能だが実行不可（APG推奨）
- 区切り線: 区切り線はフォーカス不可
- メニューを閉じる: メニューが閉じると、フォーカスは呼び出し元に戻る

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="menubar"
- [ ] Dropdown has role="menu"
- [ ] Items have correct role (menuitem/menuitemcheckbox/menuitemradio)
- [ ] Separator has role="separator"
- [ ] Radio group has role="group" with aria-label
- [ ] All <li> have role="none"
- [ ] Submenu holder has aria-haspopup="menu"
- [ ] Submenu holder has aria-expanded
- [ ] Submenu has aria-labelledby referencing parent menuitem
- [ ] Checkbox/radio has aria-checked
- [ ] Closed menu has aria-hidden="true"

### 高優先度: キーボード

- [ ] ArrowRight moves to next menubar item (wrap)
- [ ] ArrowLeft moves to previous menubar item (wrap)
- [ ] ArrowDown opens submenu, focuses first item
- [ ] ArrowUp opens submenu, focuses last item
- [ ] Enter/Space opens submenu
- [ ] Tab/Shift+Tab moves out, closes all menus
- [ ] Checkbox toggle does not close menu
- [ ] Radio selection does not close menu
- [ ] Only one radio in group can be checked

### 高優先度: フォーカス管理

- [ ] First menubar item has tabIndex="0"
- [ ] Other items have tabIndex="-1"
- [ ] Separator is not focusable
- [ ] Disabled items are focusable but not activatable

### 高優先度: クリック動作

- [ ] Click menubar item opens/closes menu
- [ ] Hover switches menu when open
- [ ] Click outside closes menu

### 中優先度: アクセシビリティ

- [ ] No axe-core violations

## 実装ノート


Structure:

┌─────────────────────────────────────────────────────────────┐
│ <ul role="menubar" aria-label="Application">                │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│ │ <li       │ │ <li       │ │ <li       │ │ <li       │    │
│ │  role=    │ │  role=    │ │  role=    │ │  role=    │    │
│ │  none>    │ │  none>    │ │  none>    │ │  none>    │    │
│ │ ┌───────┐ │ │ ┌───────┐ │ │ ┌───────┐ │ │ ┌───────┐ │    │
│ │ │menuitem│ │ │ │menuitem│ │ │ │menuitem│ │ │ │menuitem│ │   │
│ │ │"File" │ │ │ │"Edit" │ │ │ │"View" │ │ │ │"Help" │ │    │
│ │ │tabindex│ │ │ │tabindex│ │ │ │tabindex│ │ │ │       │ │    │
│ │ │=0      │ │ │ │=-1     │ │ │ │=-1     │ │ │ │       │ │    │
│ │ │aria-   │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │haspopup│ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │="menu" │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │aria-   │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │expanded│ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ └───┬───┘ │ │ └────────┘ │ │ └────────┘ │ │ └───────┘ │    │
│ └─────┼─────┘ └───────────┘ └───────────┘ └───────────┘    │
│       ▼                                                      │
│ ┌─────────────────────────────┐                              │
│ │ <ul role="menu"             │                              │
│ │  aria-labelledby="file-btn">│  ← References parent        │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <span role="menuitem"> │ │                              │
│ │ │   New                   │ │                              │
│ │ └─────────────────────────┘ │                              │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <hr role="separator">  │ │                              │
│ │ └─────────────────────────┘ │                              │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <span role=            │ │                              │
│ │ │   "menuitemcheckbox"    │ │                              │
│ │ │   aria-checked="true">  │ │                              │
│ │ │   Auto Save             │ │                              │
│ │ └─────────────────────────┘ │                              │
│ └─────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘

Critical Implementation Points:
1. All <li> must have role="none" to hide list semantics
2. aria-haspopup="menu" - use explicit "menu", not true
3. Submenu aria-labelledby - must reference parent menuitem ID
4. Checkbox/radio activation keeps menu open - unlike regular menuitem
5. Hover menu switching - only when a menu is already open
6. Context-dependent ←/→ - behavior differs in menubar vs menu vs submenu


## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Menubar horizontal navigation
it('ArrowRight moves to next menubar item', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const fileItem = screen.getByRole('menuitem', { name: 'File' });
  fileItem.focus();

  await user.keyboard('{ArrowRight}');

  expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
});

// Open submenu
it('ArrowDown opens submenu and focuses first item', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const fileItem = screen.getByRole('menuitem', { name: 'File' });
  fileItem.focus();

  await user.keyboard('{ArrowDown}');

  expect(fileItem).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
});

// Checkbox toggle keeps menu open
it('checkbox toggle does not close menu', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const viewItem = screen.getByRole('menuitem', { name: 'View' });
  await user.click(viewItem);

  const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
  checkbox.focus();

  await user.keyboard('{Space}');

  // Menu should still be open
  expect(viewItem).toHaveAttribute('aria-expanded', 'true');
  expect(checkbox).toHaveAttribute('aria-checked', 'true');
});

// li elements have role="none"
it('all li elements have role="none"', () => {
  render(<Menubar items={menuItems} aria-label="Application" />);

  const listItems = document.querySelectorAll('li');
  listItems.forEach(li => {
    expect(li).toHaveAttribute('role', 'none');
  });
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/menubar/react/demo/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  const menubar = page.getByRole('menubar');
  await expect(menubar).toBeVisible();

  // Check aria-haspopup="menu" (not "true")
  const fileItem = page.getByRole('menuitem', { name: 'File' });
  const haspopup = await fileItem.getAttribute('aria-haspopup');
  expect(haspopup).toBe('menu');

  // Check all li elements have role="none"
  const listItems = page.locator('li');
  const count = await listItems.count();
  for (let i = 0; i < count; i++) {
    await expect(listItems.nth(i)).toHaveAttribute('role', 'none');
  }
});

// Keyboard navigation test
test('ArrowDown opens submenu and focuses first item', async ({ page }) => {
  const fileItem = page.getByRole('menuitem', { name: 'File' });
  await fileItem.focus();
  await page.keyboard.press('ArrowDown');

  await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

  const menu = page.getByRole('menu');
  const firstMenuItem = menu.getByRole('menuitem').first();
  await expect(firstMenuItem).toBeFocused();
});

// Checkbox/Radio behavior test
test('checkbox toggle keeps menu open', async ({ page }) => {
  const viewItem = page.getByRole('menuitem', { name: 'View' });
  await viewItem.click();

  const checkbox = page.getByRole('menuitemcheckbox').first();
  const initialChecked = await checkbox.getAttribute('aria-checked');
  await checkbox.focus();
  await page.keyboard.press('Space');

  // Menu should still be open
  await expect(viewItem).toHaveAttribute('aria-expanded', 'true');
  // aria-checked should have toggled
  const newChecked = await checkbox.getAttribute('aria-checked');
  expect(newChecked).not.toBe(initialChecked);
});
```
