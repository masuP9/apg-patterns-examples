# Tree View Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

## 概要

ツリービューは展開・折りたたみ可能なノードの階層的なリストを表示します。単一選択・複数選択モード、キーボードナビゲーション、タイプアヘッド検索をサポートします。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `tree` | コンテナ（<ul>） | ツリーウィジェットのコンテナ |
| `treeitem` | 各ノード（<li>） | 個々のツリーノード（親ノードとリーフノードの両方） |
| `group` | 子コンテナ（<ul>） | 展開された親の子ノードのコンテナ |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `role="tree"` | [object Object] | - | はい | コンテナをツリーウィジェットとして識別 |
| `aria-label` | tree | String | はい | ツリーのアクセシブルな名前 |
| `aria-labelledby` | tree | ID参照 | はい | aria-labelの代替（優先される） |
| `aria-multiselectable` | tree | true | いいえ | 複数選択モードでのみ存在 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-expanded` | 親treeitem | `true` \| `false` | はい | Click、ArrowRight、ArrowLeft、Enter |
| `aria-selected` | すべてのtreeitem | `true` \| `false` | はい | Click、Enter、Space、矢印キー |
| `aria-disabled` | 無効化されたtreeitem | true | いいえ |  |

## キーボードサポート

### ナビゲーション

| キー | アクション |
| --- | --- |
| `ArrowDown` | 次の表示ノードにフォーカスを移動 |
| `ArrowUp` | 前の表示ノードにフォーカスを移動 |
| `ArrowRight` | 閉じた親: 展開 / 開いた親: 最初の子へ移動 / リーフ: 操作なし |
| `ArrowLeft` | 開いた親: 折りたたみ / 子または閉じた親: 親へ移動 / ルート: 操作なし |
| `Home` | 最初のノードにフォーカスを移動 |
| `End` | 最後の表示ノードにフォーカスを移動 |
| `Enter` | ノードを選択してアクティブ化（下記選択セクション参照） |
| `*` | 現在のレベルのすべての兄弟を展開 |
| `[object Object]` | その文字で始まる次の表示ノードにフォーカスを移動 |

### 選択（単一選択モード）

| キー | アクション |
| --- | --- |
| `ArrowDown / ArrowUp` | フォーカスのみ移動（選択はフォーカスに追従しない） |
| `Enter` | フォーカスされたノードを選択してアクティブ化（onActivateコールバックを発火） |
| `Space` | フォーカスされたノードを選択してアクティブ化（onActivateコールバックを発火） |
| `[object Object]` | クリックしたノードを選択してアクティブ化（onActivateコールバックを発火） |

### 選択（複数選択モード）

| キー | アクション |
| --- | --- |
| `Space` | フォーカスされたノードの選択を切り替え |
| `Ctrl + Space` | フォーカスを移動せずに選択を切り替え |
| `Shift + ArrowDown / ArrowUp` | アンカーから選択範囲を拡張 |
| `Shift + Home` | 最初のノードまで選択を拡張 |
| `Shift + End` | 最後の表示ノードまで選択を拡張 |
| `Ctrl + A` | すべての表示ノードを選択 |

## フォーカス管理

- Roving tabindex: 1つのノードのみが<code>tabindex="0"</code>を持つ（フォーカスされたノード）
- 他のノード: 他のすべてのノードは<code>tabindex="-1"</code>を持つ
- 単一Tabストップ: ツリーは単一のTabストップ（Tabで入り、Shift+Tabで出る）
- 表示ノードのみ: フォーカスは表示ノード間のみを移動（折りたたまれた子はスキップ）
- 折りたたみ動作: 子にフォーカスがある状態で親を折りたたむと、フォーカスは親に移動

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="tree"
- [ ] Each node has role="treeitem"
- [ ] Child containers have role="group"
- [ ] Parent nodes have aria-expanded
- [ ] Leaf nodes do NOT have aria-expanded
- [ ] All treeitems have aria-selected
- [ ] Tree has accessible name (aria-label or aria-labelledby)

### 高優先度: キーボード

- [ ] ArrowDown/ArrowUp navigates visible nodes
- [ ] ArrowRight/ArrowLeft expand/collapse or navigate
- [ ] Home/End move to first/last visible node

### 高優先度: フォーカス管理

- [ ] Roving tabindex implemented correctly
- [ ] Collapsed children are skipped in navigation

### 高優先度: Behavior

- [ ] Single-select mode allows only one selection
- [ ] Multi-select mode supports range selection

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Structure

```html
<ul role="tree" aria-label="File explorer">
  <li role="treeitem" aria-expanded="true" aria-selected="false" tabindex="0">
    Documents
    <ul role="group">
      <li role="treeitem" aria-selected="false" tabindex="-1">
        Resume.pdf
      </li>
      <li role="treeitem" aria-expanded="false" aria-selected="false" tabindex="-1">
        Projects
        <ul role="group">
          <li role="treeitem" aria-selected="false" tabindex="-1">
            Project1.doc
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

## Key Implementation Points

1. **Roving Tabindex**: Only one treeitem has tabindex="0" at a time
2. **aria-expanded**: Only parent nodes have this attribute
3. **aria-selected**: All treeitems must have this when selection is supported
4. **role="group"**: Child containers use group role, not tree
5. **Visible Navigation**: Focus only moves among visible (not collapsed) nodes
6. **Collapse Focus**: When a parent is collapsed while child is focused, focus moves to parent

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has tree role', () => {
  render(<TreeView items={items} aria-label="Files" />);
  expect(screen.getByRole('tree')).toBeInTheDocument();
});

// Navigation
it('ArrowDown moves focus to next visible node', async () => {
  const user = userEvent.setup();
  render(<TreeView items={items} aria-label="Files" />);

  const treeItems = screen.getAllByRole('treeitem');
  treeItems[0].focus();
  await user.keyboard('{ArrowDown}');

  expect(treeItems[1]).toHaveFocus();
});

// Expand/Collapse
it('ArrowRight expands closed parent node', async () => {
  const user = userEvent.setup();
  render(<TreeView items={itemsWithChildren} aria-label="Files" />);

  const parent = screen.getByRole('treeitem', { name: /documents/i });
  expect(parent).toHaveAttribute('aria-expanded', 'false');

  parent.focus();
  await user.keyboard('{ArrowRight}');

  expect(parent).toHaveAttribute('aria-expanded', 'true');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');
  const tree = page.getByRole('tree');

  await expect(tree).toBeVisible();
  await expect(tree).toHaveAttribute('aria-label');
});

// Navigation
test('arrow keys navigate between visible nodes', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');
  const treeItems = page.getByRole('treeitem');

  await treeItems.first().click();
  await page.keyboard.press('ArrowDown');

  await expect(treeItems.nth(1)).toBeFocused();
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="tree"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
