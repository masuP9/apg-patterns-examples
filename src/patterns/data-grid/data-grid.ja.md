# Data Grid Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

## 概要

データグリッドは、ナビゲーション、選択、編集をサポートするインタラクティブなセルを持つ表形式のデータを表示します。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `grid` | コンテナ | グリッドとして要素を識別します。グリッドはセルの行を含みます。 |
| `row` | 各行 | セルの行を識別します |
| `gridcell` | 各セル | グリッド内のインタラクティブなセルを識別します |
| `rowheader` | 行ヘッダーセル | 行のヘッダーとしてセルを識別します |
| `columnheader` | 列ヘッダーセル | 列のヘッダーとしてセルを識別します |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-rowcount` | grid | 総行数 | いいえ | 行が仮想化されている場合に必須 |
| `aria-colcount` | grid | 総列数 | いいえ | 列が非表示または仮想化されている場合に必須 |
| `aria-rowindex` | [object Object] | グリッド内の行の位置 | いいえ | 行が仮想化されている場合に必須 |
| `aria-colindex` | [object Object] | グリッド内の列の位置 | いいえ | 列が非表示または仮想化されている場合に必須 |
| `aria-sort` | columnheader | `"ascending"` \| `"descending"` \| `"none"` \| `"other"` | いいえ | 列のソート状態を示します |
| `aria-describedby` | grid | 説明要素へのID参照 | いいえ | グリッドに関する追加のコンテキストを提供します |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-selected` | gridcell または row | `true` \| `false` | いいえ | クリック、Space、Ctrl/Cmd+クリック |
| `aria-readonly` | grid または gridcell | `true` \| `false` | いいえ | グリッド/セルの設定 |
| `aria-disabled` | grid、row、または gridcell | `true` \| `false` | いいえ | グリッド/行/セルの状態変更 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `ArrowRight` | フォーカスを右に1セル移動します。末尾の場合は次の行に折り返します。 |
| `ArrowLeft` | フォーカスを左に1セル移動します。先頭の場合は前の行に折り返します。 |
| `ArrowDown` | フォーカスを下に1セル移動します。 |
| `ArrowUp` | フォーカスを上に1セル移動します。 |
| `Home` | 行の最初のセルにフォーカスを移動します。 |
| `End` | 行の最後のセルにフォーカスを移動します。 |
| `Ctrl + Home` | グリッドの最初のセルにフォーカスを移動します。 |
| `Ctrl + End` | グリッドの最後のセルにフォーカスを移動します。 |
| `Page Down` | フォーカスを1ページ下に移動します（実装依存）。 |
| `Page Up` | フォーカスを1ページ上に移動します（実装依存）。 |
| `Space / Enter` | セルをアクティブ化します（例：編集、選択）。 |
| `Escape` | 編集モードをキャンセルまたは選択解除します。 |

## フォーカス管理

- グリッド: コンテナまたは最初のフォーカス可能なセルに tabindex="0"
- フォーカス中のセル: tabindex="0"
- 他のセル: tabindex="-1"
- セル内のインタラクティブなコンテンツ: Enterでセル内のコンテンツにフォーカス移動、Escapeで移動終了

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="grid"
- [ ] Each row has role="row"
- [ ] Each cell has role="gridcell"
- [ ] Grid has correct aria-rowcount
- [ ] Grid has correct aria-colcount
- [ ] Rows have correct aria-rowindex
- [ ] Cells have correct aria-colindex

### 高優先度: キーボード

- [ ] ArrowRight moves focus to next cell
- [ ] ArrowLeft moves focus to previous cell
- [ ] ArrowDown moves focus to cell below
- [ ] ArrowUp moves focus to cell above
- [ ] Home moves focus to first cell in row
- [ ] End moves focus to last cell in row
- [ ] Ctrl+Home moves focus to first cell in grid
- [ ] Ctrl+End moves focus to last cell in grid

### 高優先度: フォーカス管理

- [ ] Focused cell has tabIndex="0"
- [ ] Other cells have tabIndex="-1"
- [ ] Only one tabIndex="0" in grid at any time

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Structure

```
┌─────────────────────────────────────────────────────────┐
│ [Header 1] [Header 2] [Header 3]  ← columnheader       │
├─────────────────────────────────────────────────────────┤
│ [Row 1 H] │ [Cell 1]  │ [Cell 2]   ← row/gridcell      │
│ [Row 2 H] │ [Cell 3]  │ [Cell 4]                        │
│ [Row 3 H] │ [Cell 5]  │ [Cell 6]                        │
└─────────────────────────────────────────────────────────┘

ARIA Relationships:
- grid: aria-rowcount, aria-colcount
- row: aria-rowindex
- gridcell: aria-colindex
```

## Focus Management (Roving Tabindex)

- Only one cell has tabindex="0" at a time
- Arrow keys move focus AND update tabindex
- Tab/Shift+Tab moves focus in/out of grid

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Keyboard navigation test
it('ArrowRight moves to next cell', async () => {
  const user = userEvent.setup();
  render(<DataGrid data={testData} />);

  const firstCell = screen.getAllByRole('gridcell')[0];
  firstCell.focus();

  await user.keyboard('{ArrowRight}');

  const secondCell = screen.getAllByRole('gridcell')[1];
  expect(secondCell).toHaveFocus();
  expect(secondCell).toHaveAttribute('tabIndex', '0');
  expect(firstCell).toHaveAttribute('tabIndex', '-1');
});

// ARIA attributes test
it('grid has correct ARIA attributes', () => {
  render(<DataGrid data={testData} />);
  const grid = screen.getByRole('grid');

  expect(grid).toHaveAttribute('aria-rowcount', String(testData.length + 1));
  expect(grid).toHaveAttribute('aria-colcount', String(columns.length));
});

// Roving tabindex test
it('only one cell has tabindex=0', () => {
  render(<DataGrid data={testData} />);
  const cells = screen.getAllByRole('gridcell');

  const tabbableCells = cells.filter(
    cell => cell.getAttribute('tabIndex') === '0'
  );
  expect(tabbableCells).toHaveLength(1);
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('data grid has proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/data-grid/react/demo/');
  const grid = page.getByRole('grid');

  // Check roles
  await expect(grid).toBeAttached();
  await expect(grid.getByRole('row').first()).toBeAttached();
  await expect(grid.getByRole('gridcell').first()).toBeAttached();

  // Check aria-rowcount and aria-colcount
  await expect(grid).toHaveAttribute('aria-rowcount', /.+/);
  await expect(grid).toHaveAttribute('aria-colcount', /.+/);
});

// Keyboard navigation test
test('arrow keys navigate between cells', async ({ page }) => {
  await page.goto('patterns/data-grid/react/demo/');
  const grid = page.getByRole('grid');
  const cells = grid.getByRole('gridcell');
  const firstCell = cells.first();

  await firstCell.click();
  await expect(firstCell).toBeFocused();

  await page.keyboard.press('ArrowRight');
  const secondCell = cells.nth(1);
  await expect(secondCell).toBeFocused();

  await page.keyboard.press('ArrowDown');
  // Focus should move to cell below
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/data-grid/react/demo/');
  await page.getByRole('grid').waitFor();

  const results = await new AxeBuilder({ page })
    .include('[role="grid"]')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```
