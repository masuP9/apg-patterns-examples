# Table Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/table/

## 概要

Tableはデータを表示するための静的な表構造です。Gridとは異なり、キーボード操作はありません - スクリーンリーダー向けのセマンティック構造を提供します。ネイティブのHTML <table>が強く推奨されます。ARIA tableはCSS Grid/Flexboxレイアウトの場合にのみ使用してください。

## ネイティブHTML vs カスタム実装

| ユースケース | 推奨 |
| --- | --- |
| Basic tabular data | Native <table> |
| CSS Grid/Flexbox layout | Custom role="table" |
| Responsive column reordering | Custom implementation |
| Virtualization support | Custom with ARIA |

### ネイティブ vs カスタム比較

| 機能 | ネイティブ | カスタム |
| --- | --- | --- |
| Basic tabular data | Recommended | Not needed |
| JavaScript disabled support | Works natively | Requires fallback |
| Built-in accessibility | Automatic | Manual ARIA required |
| CSS Grid/Flexbox layout | Limited (display: table) | Full control |
| Responsive column reordering | Limited | Full control |
| Virtualization support | Not built-in | With ARIA support |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `table` | コンテナ要素 | 要素をデータの行とセルを含むテーブル構造として識別します。 (required) |
| `rowgroup` | ヘッダー/ボディコンテナ | 行をグループ化します（<thead>、<tbody>、<tfoot>に相当）。 |
| `row` | 行要素 | テーブル内の1行（<tr>に相当）。 (required) |
| `columnheader` | ヘッダーセル | 列の見出しセル（ヘッダー行の<th>に相当）。 |
| `rowheader` | ヘッダーセル | 行の見出しセル（<th scope="row">に相当）。 |
| `cell` | データセル | 行内のデータセル（<td>に相当）。 (required) |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-label` | table | 文字列 | はい | テーブルのアクセシブル名を提供します。スクリーンリーダーのユーザーがテーブルの目的を理解するために必要です。 |
| `aria-labelledby` | table | ID参照 | はい | テーブルのアクセシブル名を提供する要素を参照します。 |
| `aria-describedby` | table | ID参照 | いいえ | テーブルの追加説明を提供する要素を参照します。 |
| `aria-colcount` | table | 数値 | いいえ | 一部のみがレンダリングされている場合のテーブルの総列数を定義します（仮想化用）。 |
| `aria-rowcount` | table | 数値 | いいえ | 一部のみがレンダリングされている場合のテーブルの総行数を定義します（仮想化用）。 |
| `aria-colindex` | cell/columnheader | 数値（1始まり） | いいえ | テーブル全体におけるセルの位置を示します（仮想化用）。 |
| `aria-rowindex` | row | 数値（1始まり） | いいえ | テーブル全体における行の位置を示します（仮想化用）。 |
| `aria-colspan` | cell | 数値 | いいえ | セルが何列にまたがるかを示します。1より大きい場合のみ設定します。 |
| `aria-rowspan` | cell | 数値 | いいえ | セルが何行にまたがるかを示します。1より大きい場合のみ設定します。 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-sort` | columnheader/rowheader 要素 | `ascending` \| `descending` \| `none` \| `other` | いいえ | ソート順が変更されたとき（ソートボタンクリック） |

## キーボードサポート

## フォーカス管理

- 静的テーブル: 該当なし - roving tabindexは不要
- インタラクティブ要素: リンク/ボタンは通常のTab順序でフォーカスを受け取る

## テストチェックリスト

### 高優先度: ARIA

- [ ] role="table" on container
- [ ] role="row" on all rows
- [ ] role="cell" on data cells
- [ ] role="columnheader" on header cells
- [ ] role="rowheader" when present
- [ ] role="rowgroup" when present
- [ ] Accessible name via aria-label
- [ ] Accessible name via aria-labelledby
- [ ] Description via aria-describedby (when caption)
- [ ] aria-sort="ascending" on sorted column
- [ ] aria-sort="descending" on sorted column
- [ ] aria-sort="none" on unsorted sortable columns
- [ ] Sort changes update aria-sort attribute

### 中優先度: ARIA

- [ ] aria-colcount matches total columns
- [ ] aria-rowcount matches total rows
- [ ] aria-colindex is 1-based on cells
- [ ] aria-rowindex is 1-based on rows
- [ ] aria-colspan set when cell spans >1 columns
- [ ] aria-rowspan set when cell spans >1 rows

### 中優先度: アクセシビリティ

- [ ] No axe-core violations

## 実装ノート

### CSS Grid + Subgrid Layout

This implementation uses CSS Grid with Subgrid for visual cell spanning support.

```
┌─────────────────────────────────────────────────────────────┐
│ div.apg-table [display: grid; --table-cols: N]              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ div.apg-table-header [display: grid; subgrid]           │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ div.apg-table-row [display: contents]               │ │ │
│ │ │   → cells become direct grid items                  │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ div.apg-table-body [display: grid; subgrid]             │ │
│ │   cells with colspan/rowspan use:                       │ │
│ │     grid-column: span N                                 │ │
│ │     grid-row: span N                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Structure Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ div role="table" aria-label="..."                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ div role="rowgroup" (header)                            │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ div role="row"                                      │ │ │
│ │ │ ┌────────────┐ ┌────────────┐ ┌────────────┐       │ │ │
│ │ │ │columnheader│ │columnheader│ │columnheader│       │ │ │
│ │ │ │aria-sort   │ │            │ │            │       │ │ │
│ │ │ └────────────┘ └────────────┘ └────────────┘       │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ div role="rowgroup" (body)                              │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ div role="row" aria-rowindex="2"                    │ │ │
│ │ │ ┌────────────┐ ┌────────────┐ ┌────────────┐       │ │ │
│ │ │ │ rowheader? │ │    cell    │ │    cell    │       │ │ │
│ │ │ └────────────┘ └────────────┘ └────────────┘       │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Differences from Grid

| Aspect           | Table              | Grid                    |
| ---------------- | ------------------ | ----------------------- |
| Purpose          | Static display     | Interactive editing     |
| Keyboard         | None               | Arrow, Enter, Tab       |
| Focus management | None               | Roving tabindex         |
| Cell role        | `cell`           | `gridcell`            |
| Selection        | None               | `aria-selected`       |

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Table } from './Table';

const columns = [
  { id: 'name', header: 'Name', sortable: true, sort: 'ascending' as const },
  { id: 'age', header: 'Age', sortable: true },
];

const rows = [
  { id: '1', cells: ['Alice', '30'] },
  { id: '2', cells: ['Bob', '25'] },
];

describe('Table', () => {
  describe('APG: ARIA Structure', () => {
    it('has role="table" on container', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('has role="row" on all rows', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const allRows = screen.getAllByRole('row');
      expect(allRows).toHaveLength(3); // 1 header + 2 data rows
    });

    it('has role="columnheader" on header cells', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
    });

    it('has role="cell" on data cells', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(4); // 2 columns x 2 rows
    });
  });

  describe('APG: Sort State', () => {
    it('has aria-sort="ascending" on sorted column', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('has aria-sort="none" on unsorted sortable column', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const ageHeader = screen.getByRole('columnheader', { name: /age/i });
      expect(ageHeader).toHaveAttribute('aria-sort', 'none');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Table columns={columns} rows={rows} aria-label="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/table/react/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  const basicTable = page.locator('[role="table"][aria-label="User List"]');
  await expect(basicTable).toBeVisible();

  // Check rows (1 header + 5 data rows)
  const rows = basicTable.locator('[role="row"]');
  await expect(rows).toHaveCount(6);

  // Check columnheaders
  const headers = basicTable.locator('[role="columnheader"]');
  await expect(headers).toHaveCount(3);

  // Check data cells (5 rows x 3 columns)
  const cells = basicTable.locator('[role="cell"]');
  await expect(cells).toHaveCount(15);

  // Check rowgroups (header + body)
  const rowgroups = basicTable.locator('[role="rowgroup"]');
  await expect(rowgroups).toHaveCount(2);
});

// Sort state test
test('clicking sort button changes aria-sort', async ({ page }) => {
  const sortableTable = page.locator('[role="table"][aria-label="Sortable User List"]');
  await expect(sortableTable).toBeVisible();

  const ageHeader = sortableTable.locator('[role="columnheader"]').filter({ hasText: 'Age' });
  const sortButton = ageHeader.locator('button');

  // Initially none
  await expect(ageHeader).toHaveAttribute('aria-sort', 'none');

  // Click to sort ascending
  await sortButton.click();
  await expect(ageHeader).toHaveAttribute('aria-sort', 'ascending');

  // Click again to sort descending
  await sortButton.click();
  await expect(ageHeader).toHaveAttribute('aria-sort', 'descending');
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="table"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
