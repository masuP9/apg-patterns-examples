# Grid Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

## 概要

Grid は矢印キー、Home、End などの方向キーを使用した2次元ナビゲーションを可能にするインタラクティブなコンテナです。静的なテーブルとは異なり、セルの選択とキーボードベースのセルアクティベーションをサポートします。

## ネイティブHTML vs カスタム実装

| ユースケース | 推奨 |
| --- | --- |
| [object Object] | [object Object] |
| [object Object] | [object Object] |
| [object Object] | [object Object] |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `grid` | コンテナ | グリッドコンテナ（複合ウィジェット） (required) |
| `row` | 行コンテナ | セルを水平方向にグループ化 (required) |
| `columnheader` | ヘッダーセル | 列ヘッダー（この実装ではフォーカス不可） |
| `rowheader` | 行ヘッダーセル | 行ヘッダー（オプション） |
| `gridcell` | データセル | インタラクティブセル（フォーカス可能） (required) |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `role="grid"` | [object Object] | - | はい | コンテナをグリッドとして識別 |
| `aria-label` | grid | String | はい | グリッドのアクセシブルな名前 |
| `aria-labelledby` | grid | ID reference | はい | aria-labelの代替 |
| `aria-multiselectable` | grid | true | いいえ | 複数選択モード時のみ存在 |
| `aria-rowcount` | grid | 数値 | いいえ | 総行数（仮想化用） |
| `aria-colcount` | grid | 数値 | いいえ | 総列数（仮想化用） |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `tabindex` | gridcell | `0` \| `-1` | はい | フォーカス管理用のroving tabindex |
| `aria-selected` | gridcell | `true` \| `false` | いいえ | グリッドが選択をサポートする場合に存在。選択をサポートする場合、すべてのgridcellにaria-selectedが必要。 |
| `aria-disabled` | gridcell | true | いいえ | セルが無効であることを示す |
| `aria-rowindex` | row, gridcell | 数値 | いいえ | 行位置（仮想化用） |
| `aria-colindex` | gridcell | 数値 | いいえ | 列位置（仮想化用） |

## キーボードサポート

### 2Dナビゲーション

| キー | アクション |
| --- | --- |
| `→` | フォーカスを右のセルに移動 |
| `←` | フォーカスを左のセルに移動 |
| `↓` | フォーカスを下の行に移動 |
| `↑` | フォーカスを上の行に移動 |
| `Home` | フォーカスを行の最初のセルに移動 |
| `End` | フォーカスを行の最後のセルに移動 |
| `Ctrl + Home` | フォーカスをグリッドの最初のセルに移動 |
| `Ctrl + End` | フォーカスをグリッドの最後のセルに移動 |
| `PageDown` | フォーカスをページサイズ分下に移動（デフォルト5） |
| `PageUp` | フォーカスをページサイズ分上に移動（デフォルト5） |

### 選択とアクティベーション

| キー | アクション |
| --- | --- |
| `Space` | フォーカス中のセルを選択/選択解除（選択可能時） |
| `Enter` | フォーカス中のセルをアクティベート（onCellActivateをトリガー） |

## フォーカス管理

- Roving tabindex: 1つのセルのみがtabindex="0"（フォーカス中のセル）を持ち、他のすべてのセルはtabindex="-1"を持つ
- 単一Tabストップ: グリッドは単一のTabストップ（Tabでグリッドに入り、Shift+Tabで離脱）
- ヘッダーセル: ヘッダーセル（columnheader）はフォーカス不可（この実装ではソート機能なし）
- データセルのみ: データ行のgridcellのみがキーボードナビゲーションに含まれる
- フォーカスメモリ: グリッドを離れて再入場した際、最後にフォーカスされたセルが記憶される

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="grid"
- [ ] All rows have role="row"
- [ ] Data cells have role="gridcell"
- [ ] Header cells have role="columnheader"
- [ ] Has accessible name via aria-label or aria-labelledby
- [ ] aria-multiselectable present when multi-select enabled
- [ ] aria-selected present on all cells when selectable
- [ ] aria-disabled present on disabled cells

### 中優先度: ARIA

- [ ] Virtualization attributes correct when provided

### 高優先度: キーボード

- [ ] ArrowRight/Left/Up/Down navigate in 2D
- [ ] Home/End navigate within row
- [ ] Ctrl+Home/End navigate to grid corners
- [ ] PageUp/PageDown navigate by page size
- [ ] Space toggles cell selection
- [ ] Enter activates focused cell
- [ ] Tab exits grid to next element

### 高優先度: フォーカス管理

- [ ] Roving tabindex implemented correctly
- [ ] Header cells are not focusable
- [ ] Disabled cells are focusable but not activatable

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート


## Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ div role="grid" aria-label="..."                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ div role="row" (header row)                                 │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│ │ │ columnheader │ │ columnheader │ │ columnheader │         │ │
│ │ │ (no tabIndex)│ │ (no tabIndex)│ │ (no tabIndex)│         │ │
│ │ │ NOT focusable│ │ NOT focusable│ │ NOT focusable│         │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ div role="row" (data row)                                   │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│ │ │ gridcell     │ │ gridcell     │ │ gridcell     │         │ │
│ │ │ tabIndex=0   │ │ tabIndex=-1  │ │ tabIndex=-1  │         │ │
│ │ │ (focused)    │ │              │ │              │         │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Critical Implementation Points

1. **Header cells are NOT focusable** - no sort functionality
2. **No aria-readonly** - no edit functionality
3. **No rowgroup** - simplified structure
4. **Cell ID convention**: `${rowId}-${colIndex}` for consistent controlled mode
5. **Disabled cells**: Focusable but cannot be selected or activated
6. **CSS Grid layout**: Avoid order or grid-area reordering (visual/DOM mismatch)


## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 2D Navigation
it('ArrowRight moves focus to next cell', async () => {
  const user = userEvent.setup();
  render(<Grid columns={columns} rows={rows} ariaLabel="Test Grid" />);

  const firstCell = screen.getAllByRole('gridcell')[0];
  firstCell.focus();

  await user.keyboard('{ArrowRight}');

  expect(screen.getAllByRole('gridcell')[1]).toHaveFocus();
});

// ArrowUp does not enter header row
it('ArrowUp stops at first data row', async () => {
  const user = userEvent.setup();
  render(<Grid columns={columns} rows={rows} ariaLabel="Test Grid" />);

  const firstDataCell = screen.getAllByRole('gridcell')[0];
  firstDataCell.focus();

  await user.keyboard('{ArrowUp}');

  // Should stay on first data row, not move to header
  expect(firstDataCell).toHaveFocus();
});

// Selection toggle
it('Space toggles cell selection', async () => {
  const user = userEvent.setup();
  render(<Grid columns={columns} rows={rows} ariaLabel="Test Grid" selectable />);

  const cell = screen.getAllByRole('gridcell')[0];
  cell.focus();

  expect(cell).toHaveAttribute('aria-selected', 'false');

  await user.keyboard(' ');

  expect(cell).toHaveAttribute('aria-selected', 'true');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

// ARIA Structure
test('has correct grid structure', async ({ page }) => {
  await page.goto('patterns/grid/react/');
  const grid = page.getByRole('grid');
  await expect(grid).toBeVisible();

  // Verify rows and cells
  const rows = page.getByRole('row');
  expect(await rows.count()).toBeGreaterThan(1);
  await expect(page.getByRole('columnheader').first()).toBeVisible();
  await expect(page.getByRole('gridcell').first()).toBeVisible();
});

// 2D Keyboard Navigation
test('arrow keys navigate in 2D', async ({ page }) => {
  await page.goto('patterns/grid/react/');
  const grid = page.getByRole('grid').first();
  const cells = grid.getByRole('gridcell');

  // Focus first cell
  await cells.first().click();

  // ArrowRight moves to next cell
  await page.keyboard.press('ArrowRight');
  await expect(cells.nth(1)).toBeFocused();
});

// Roving Tabindex
test('roving tabindex updates on navigation', async ({ page }) => {
  await page.goto('patterns/grid/react/');
  const cells = page.getByRole('gridcell');
  const firstCell = cells.first();
  const secondCell = cells.nth(1);

  // Initially first cell has tabindex="0"
  await expect(firstCell).toHaveAttribute('tabindex', '0');
  await expect(secondCell).toHaveAttribute('tabindex', '-1');

  // Navigate right
  await firstCell.click();
  await page.keyboard.press('ArrowRight');

  // Tabindex should update
  await expect(firstCell).toHaveAttribute('tabindex', '-1');
  await expect(secondCell).toHaveAttribute('tabindex', '0');
});
```
