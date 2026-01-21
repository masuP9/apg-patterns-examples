# Table Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/table/

## Overview

Table is a static tabular structure for displaying data. Unlike Grid, it has no keyboard interaction - it provides semantic structure for screen readers. Native HTML <table> is strongly recommended; use ARIA table only for CSS Grid/Flexbox layouts.

## Native HTML vs Custom Implementation

| Use Case | Recommended |
| --- | --- |
| Basic tabular data | Native <table> |
| CSS Grid/Flexbox layout | Custom role="table" |
| Responsive column reordering | Custom implementation |
| Virtualization support | Custom with ARIA |

### Native vs Custom Comparison

| Feature | Native | Custom |
| --- | --- | --- |
| Basic tabular data | Recommended | Not needed |
| JavaScript disabled support | Works natively | Requires fallback |
| Built-in accessibility | Automatic | Manual ARIA required |
| CSS Grid/Flexbox layout | Limited (display: table) | Full control |
| Responsive column reordering | Limited | Full control |
| Virtualization support | Not built-in | With ARIA support |

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `table` | Container element | Identifies the element as a table structure containing rows and cells of data. (required) |
| `rowgroup` | Header/Body container | Groups rows together (equivalent to <thead>, <tbody>, <tfoot>). |
| `row` | Row element | A row of cells within the table (equivalent to <tr>). (required) |
| `columnheader` | Header cell | A header cell for a column (equivalent to <th> in header row). |
| `rowheader` | Header cell | A header cell for a row (equivalent to <th scope="row">). |
| `cell` | Data cell | A data cell within a row (equivalent to <td>). (required) |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-label` | table | String | Yes | Provides an accessible name for the table. Required for screen reader users to understand the table's purpose. |
| `aria-labelledby` | table | ID reference | Yes | References an element that provides the accessible name for the table. |
| `aria-describedby` | table | ID reference | No | References an element providing additional description for the table. |
| `aria-colcount` | table | Number | No | Defines the total number of columns in the table when only a subset is rendered (virtualization). |
| `aria-rowcount` | table | Number | No | Defines the total number of rows in the table when only a subset is rendered (virtualization). |
| `aria-colindex` | cell/columnheader | Number (1-based) | No | Indicates the position of a cell within the full table (virtualization). |
| `aria-rowindex` | row | Number (1-based) | No | Indicates the position of a row within the full table (virtualization). |
| `aria-colspan` | cell | Number | No | Indicates how many columns the cell spans. Only set when >1. |
| `aria-rowspan` | cell | Number | No | Indicates how many rows the cell spans. Only set when >1. |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-sort` | columnheader/rowheader | `ascending` \| `descending` \| `none` \| `other` | No | When sort order changes (click sort button) |

## Keyboard Support

## Focus Management

- Static table: Not applicable - no roving tabindex needed
- Interactive elements: Links/buttons receive focus via normal tab order

## Test Checklist

### High Priority: ARIA

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

### Medium Priority: ARIA

- [ ] aria-colcount matches total columns
- [ ] aria-rowcount matches total rows
- [ ] aria-colindex is 1-based on cells
- [ ] aria-rowindex is 1-based on rows
- [ ] aria-colspan set when cell spans >1 columns
- [ ] aria-rowspan set when cell spans >1 rows

### Medium Priority: Accessibility

- [ ] No axe-core violations

## Implementation Notes

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

## Example Test Code (React + Testing Library)

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

## Example E2E Test Code (Playwright)

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
