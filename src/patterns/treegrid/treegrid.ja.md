# Treegrid Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/

## 概要

TreeGridは、Gridの2Dキーボードナビゲーションと、TreeViewの階層展開/折りたたみ機能を組み合わせたものです。行は子行を表示するために展開でき、選択はセルではなく行に対して行われます。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `treegrid` | コンテナ | treegridコンテナ（複合ウィジェット） |
| `row` | 行コンテナ | セルを水平方向にグループ化し、子を持つことができます |
| `columnheader` | ヘッダーセル | 列ヘッダー（フォーカス不可） |
| `rowheader` | 最初の列セル | ツリー操作が行われる行ヘッダー |
| `gridcell` | データセル | インタラクティブなセル（フォーカス可能） |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `role="treegrid"` | Container | - | はい | コンテナをtreegridとして識別します |
| `aria-label` | treegrid | 文字列 | はい | treegridのアクセシブルな名前 |
| `aria-labelledby` | treegrid | ID参照 | はい | aria-labelの代替 |
| `aria-multiselectable` | treegrid | true | いいえ | 複数選択モードの場合のみ存在 |
| `aria-rowcount` | treegrid | 数値 | いいえ | 総行数（仮想化用） |
| `aria-colcount` | treegrid | 数値 | いいえ | 総列数（仮想化用） |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-level` | row | 数値（1始まり） | はい | 行ごとに静的（階層構造により決定） |
| `aria-expanded` | row（親のみ） | `true` \| `false` | はい | rowheaderでのArrowRight/Left、展開アイコンのクリック |
| `aria-selected` | row | `true` \| `false` | いいえ | Spaceキー、クリック（gridcellではなく行に設定） |
| `aria-disabled` | row | true | いいえ | 行が無効な場合のみ |
| `aria-rowindex` | row | 数値 | いいえ | 静的（仮想化用） |

## キーボードサポート

### 2Dナビゲーション

| キー | アクション |
| --- | --- |
| `Arrow Down` | 次の表示行の同じ列にフォーカスを移動 |
| `Arrow Up` | 前の表示行の同じ列にフォーカスを移動 |
| `Arrow Right` | フォーカスを右に1セル移動（非rowheaderセルの場合） |
| `Arrow Left` | フォーカスを左に1セル移動（非rowheaderセルの場合） |
| `Home` | 行の最初のセルにフォーカスを移動 |
| `End` | 行の最後のセルにフォーカスを移動 |
| `Ctrl + Home` | treegridの最初のセルにフォーカスを移動 |
| `Ctrl + End` | treegridの最後のセルにフォーカスを移動 |

### ツリー操作（rowheaderのみ）

| キー | アクション |
| --- | --- |
| `Arrow Right (at rowheader)` | 折りたたまれた親の場合: 行を展開。展開された親の場合: 最初の子のrowheaderに移動。リーフの場合: 何もしない |
| `Arrow Left (at rowheader)` | 展開された親の場合: 行を折りたたみ。折りたたみ済み/リーフの場合: 親のrowheaderに移動。ルートレベルで折りたたみ済みの場合: 何もしない |

### 行選択とセルアクティベーション

| キー | アクション |
| --- | --- |
| `Space` | 行の選択を切り替え（セル選択ではない） |
| `Enter` | フォーカスされたセルをアクティブ化（展開/折りたたみはしない） |
| `Ctrl + A` | すべての表示行を選択（複数選択可能な場合） |

## フォーカス管理

- フォーカスモデル: ローヴィングタブインデックス - 1つのセルのみがtabindex="0"を持つ
- 他のセル: tabindex="-1"
- TreeGrid: 単一のTabストップ（Tabでグリッドに入る/出る）
- 列ヘッダー: フォーカス不可（tabindexなし）
- 折りたたまれた子: キーボードナビゲーションに含まれない
- 親の折りたたみ: 子にフォーカスがあった場合、親にフォーカスを移動

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="treegrid"
- [ ] Each row has role="row"
- [ ] First cell has role="rowheader"
- [ ] Other cells have role="gridcell"
- [ ] Header cells have role="columnheader"
- [ ] All rows have aria-level
- [ ] Parent rows have aria-expanded (true/false)
- [ ] Selection uses aria-selected on row (not cell)

### 高優先度: キーボード

- [ ] ArrowRight expands collapsed parent at rowheader
- [ ] ArrowLeft collapses expanded parent at rowheader
- [ ] ArrowRight/Left navigate cells at non-rowheader
- [ ] ArrowDown/Up navigate visible rows
- [ ] Home/End navigate to first/last cell in row
- [ ] Ctrl+Home/End navigate to first/last cell in treegrid
- [ ] Space toggles row selection
- [ ] Enter activates cell (does NOT expand/collapse)

### 高優先度: フォーカス管理

- [ ] Focused cell has tabIndex="0"
- [ ] Other cells have tabIndex="-1"
- [ ] Column headers are not focusable
- [ ] Tab enters/exits treegrid (single tab stop)
- [ ] Focus moves to parent when child collapses

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Structure

```
┌─────────────────────────────────────────────────────────┐
│ [Header 1] [Header 2] [Header 3]  ← columnheader (not focusable)
├─────────────────────────────────────────────────────────┤
│ ▼ [Parent]  │ [Cell]   │ [Cell]   ← row (aria-level="1", aria-expanded="true")
│   [Child 1] │ [Cell]   │ [Cell]   ← row (aria-level="2")
│   [Child 2] │ [Cell]   │ [Cell]   ← row (aria-level="2")
│ ▶ [Parent]  │ [Cell]   │ [Cell]   ← row (aria-level="1", aria-expanded="false")
│ [Leaf]      │ [Cell]   │ [Cell]   ← row (aria-level="1", NO aria-expanded)
└─────────────────────────────────────────────────────────┘
          ↑                     ↑
       rowheader             gridcell
```

## Key Differences from Grid

| Feature | TreeGrid | Grid |
|---------|----------|------|
| Selection | Row selection (aria-selected on row) | Cell selection |
| Arrow at rowheader | Expand/collapse tree | Move focus |
| Enter key | Cell activation only | Cell activation |
| Hierarchy | aria-level, aria-expanded on rows | None |
| Navigation | Collapsed children skipped | All cells |

## Focus Management (Roving Tabindex)

- Only one cell has tabindex="0" at a time
- Arrow keys move focus AND update tabindex
- Tab/Shift+Tab enters/exits treegrid
- When parent collapses with focus on child, move focus to parent

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA structure test
it('has correct treegrid structure', () => {
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" />);

  const treegrid = screen.getByRole('treegrid');
  expect(treegrid).toHaveAttribute('aria-label', 'Files');

  const rows = screen.getAllByRole('row');
  expect(rows.length).toBeGreaterThan(0);

  // Check parent row has aria-level and aria-expanded
  const parentRow = rows.find(r => r.getAttribute('aria-expanded') !== null);
  expect(parentRow).toHaveAttribute('aria-level');
});

// Tree operation test
it('expands/collapses row with arrow keys at rowheader', async () => {
  const user = userEvent.setup();
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" />);

  const rowheader = screen.getAllByRole('rowheader')[0];
  rowheader.focus();

  // Expand
  await user.keyboard('{ArrowRight}');
  const parentRow = rowheader.closest('[role="row"]');
  expect(parentRow).toHaveAttribute('aria-expanded', 'true');

  // Collapse
  await user.keyboard('{ArrowLeft}');
  expect(parentRow).toHaveAttribute('aria-expanded', 'false');
});

// Row selection test
it('toggles row selection with Space', async () => {
  const user = userEvent.setup();
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" selectable />);

  const cell = screen.getAllByRole('gridcell')[0];
  cell.focus();

  await user.keyboard(' ');
  const row = cell.closest('[role="row"]');
  expect(row).toHaveAttribute('aria-selected', 'true');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('treegrid has proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/treegrid/react/demo/');
  const treegrid = page.getByRole('treegrid');

  await expect(treegrid).toBeAttached();
  await expect(treegrid).toHaveAttribute('aria-label', /.+/);

  // Check rows have aria-level
  const rows = treegrid.getByRole('row');
  const firstRow = rows.first();
  await expect(firstRow).toHaveAttribute('aria-level');
});

// Tree operation test
test('arrow keys expand/collapse at rowheader', async ({ page }) => {
  await page.goto('patterns/treegrid/react/demo/');
  const rowheader = page.getByRole('rowheader').first();

  await rowheader.click();

  // Get parent row
  const row = page.getByRole('row').filter({ has: rowheader });

  // If collapsed, expand
  const isExpanded = await row.getAttribute('aria-expanded');
  if (isExpanded === 'false') {
    await page.keyboard.press('ArrowRight');
    await expect(row).toHaveAttribute('aria-expanded', 'true');
  }

  // Collapse
  await page.keyboard.press('ArrowLeft');
  await expect(row).toHaveAttribute('aria-expanded', 'false');
});

// Keyboard navigation test
test('arrow keys navigate between visible rows', async ({ page }) => {
  await page.goto('patterns/treegrid/react/demo/');
  const cells = page.getByRole('gridcell');
  const firstCell = cells.first();

  await firstCell.click();
  await expect(firstCell).toBeFocused();

  await page.keyboard.press('ArrowDown');
  // Focus should move to cell in next visible row
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/treegrid/react/demo/');
  await page.getByRole('treegrid').waitFor();

  const results = await new AxeBuilder({ page })
    .include('[role="treegrid"]')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```
