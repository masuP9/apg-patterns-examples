# Table Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/table/

## Overview

Table is a static tabular structure for displaying data. Unlike Grid, it has no keyboard interaction - it provides semantic structure for screen readers. Native HTML `<table>` is strongly recommended; use ARIA table only for CSS Grid/Flexbox layouts.

## ARIA Requirements

### Roles

| Role           | Element        | Description                        |
| -------------- | -------------- | ---------------------------------- |
| `table`        | Container      | Table container                    |
| `rowgroup`     | Group          | Groups rows (thead, tbody, tfoot)  |
| `row`          | Row container  | Single table row                   |
| `columnheader` | Header cell    | Column heading                     |
| `rowheader`    | Header cell    | Row heading (first cell)           |
| `cell`         | Data cell      | Regular data cell                  |

### Properties

| Attribute           | Element              | Values     | Required | Notes                           |
| ------------------- | -------------------- | ---------- | -------- | ------------------------------- |
| `aria-label`        | table                | string     | Yes*     | Accessible name (*or labelledby)|
| `aria-labelledby`   | table                | ID ref     | Yes*     | Accessible name (*or label)     |
| `aria-describedby`  | table                | ID ref     | No       | Reference to caption/description|
| `aria-colcount`     | table                | number     | No       | Total columns (virtualization)  |
| `aria-rowcount`     | table                | number     | No       | Total rows (virtualization)     |
| `aria-colindex`     | cell/columnheader    | number     | No       | Column position (1-based)       |
| `aria-rowindex`     | row                  | number     | No       | Row position (1-based)          |
| `aria-colspan`      | cell                 | number     | No       | Columns spanned                 |
| `aria-rowspan`      | cell                 | number     | No       | Rows spanned                    |

### States

| Attribute    | Element              | Values                                   | Required | Change Trigger |
| ------------ | -------------------- | ---------------------------------------- | -------- | -------------- |
| `aria-sort`  | columnheader/rowheader | `ascending`/`descending`/`none`        | No       | Sort action    |

## Keyboard Support

**Not applicable** - Table is a static structure. No keyboard navigation required.

> Interactive elements within cells (links, buttons) receive focus via normal tab order.

## Focus Management

**Not applicable** - No roving tabindex needed for static tables.

## Test Checklist

### High Priority: ARIA Structure

- [ ] Container has `role="table"`
- [ ] All rows have `role="row"`
- [ ] Data cells have `role="cell"`
- [ ] Column headers have `role="columnheader"`
- [ ] Row headers have `role="rowheader"` (when present)
- [ ] Groups have `role="rowgroup"` (when present)

### High Priority: Accessible Name

- [ ] Table has accessible name via `aria-label`
- [ ] Table has accessible name via `aria-labelledby`
- [ ] Table has description via `aria-describedby` (when caption present)

### High Priority: Sort State

- [ ] Sorted column has `aria-sort="ascending"` or `"descending"`
- [ ] Unsorted sortable columns have `aria-sort="none"`
- [ ] Sort changes update `aria-sort` attribute

### Medium Priority: Virtualization

- [ ] `aria-colcount` matches total columns
- [ ] `aria-rowcount` matches total rows
- [ ] `aria-colindex` is 1-based on cells
- [ ] `aria-rowindex` is 1-based on rows

### Medium Priority: Cell Spanning

- [ ] `aria-colspan` is set when cell spans >1 columns
- [ ] `aria-rowspan` is set when cell spans >1 rows
- [ ] Spanning values >1 only (omit for single cells)

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

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
│ │   cells with colspan/rowspan use:                       ││
│ │     grid-column: span N                                 │ │
│ │     grid-row: span N                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### CSS Variables

| Variable        | Purpose                    | Example          |
| --------------- | -------------------------- | ---------------- |
| `--table-cols`  | Number of columns          | `3`              |

#### Key CSS Rules

```css
.apg-table {
  display: grid;
  grid-template-columns: repeat(var(--table-cols, 1), 1fr);
  gap: 1px;
  background: var(--border);  /* Gap creates borders */
}

.apg-table-header,
.apg-table-body {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.apg-table-row {
  display: contents;  /* Row disappears, cells become grid items */
}

.apg-table-cell {
  background: var(--background);  /* Cell background covers gap */
}
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
| Cell role        | `cell`             | `gridcell`              |
| Selection        | None               | `aria-selected`         |

### When to Use Native HTML

**Prefer `<table>` when:**
- Standard tabular data layout
- No custom styling requirements
- Form submission needed

**Use ARIA table when:**
- CSS Grid/Flexbox layout required
- Custom visual design
- Dynamic column reordering

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

## Implementation Differences from Plan

### Svelte 5 API Change

Svelte 5 deprecated `createEventDispatcher` and `$on`. Use callback props instead:

```svelte
// ❌ Old (Svelte 4)
const dispatch = createEventDispatcher();
dispatch('sortChange', { columnId, direction });

// ✅ New (Svelte 5)
interface Props {
  onSortChange?: (columnId: string, direction: 'ascending' | 'descending') => void;
}
let { onSortChange }: Props = $props();
onSortChange?.(columnId, direction);
```

### Cell Spanning Support

Cells support `colspan` and `rowspan` via `TableCell` interface. Both ARIA attributes and visual CSS Grid spanning are applied:

```typescript
interface TableCell {
  content: string | ReactNode;
  colspan?: number;  // aria-colspan + grid-column: span N
  rowspan?: number;  // aria-rowspan + grid-row: span N
}

type TableCellValue = string | ReactNode | TableCell;

// Usage
const rows = [
  {
    id: '1',
    cells: [
      { content: 'Merged', colspan: 2 },  // Visually spans 2 columns
      'Normal'
    ]
  },
  {
    id: '2',
    cells: [
      { content: 'Tall', rowspan: 2 },    // Visually spans 2 rows
      'A', 'B'
    ]
  },
  {
    id: '3',
    cells: ['C', 'D']  // First cell skipped due to rowspan above
  }
];
```

#### Framework-specific Grid Styles

**React**:
```tsx
const gridStyle: React.CSSProperties = {};
if (cell.colspan > 1) gridStyle.gridColumn = `span ${cell.colspan}`;
if (cell.rowspan > 1) gridStyle.gridRow = `span ${cell.rowspan}`;
```

**Vue**:
```vue
:style="{
  gridColumn: cell.colspan > 1 ? `span ${cell.colspan}` : undefined,
  gridRow: cell.rowspan > 1 ? `span ${cell.rowspan}` : undefined,
}"
```

**Svelte**:
```svelte
style:grid-column={cell.colspan > 1 ? `span ${cell.colspan}` : undefined}
style:grid-row={cell.rowspan > 1 ? `span ${cell.rowspan}` : undefined}
```

### Demo Components

Each framework has demo components for multiple variants:
- `basic` - Simple static table
- `sortable` - Interactive sort with `aria-sort`
- `rowHeader` - First cell as `role="rowheader"`
- `virtualized` - Large dataset with `aria-rowindex`
- `spanning` - Cells with visual `colspan`/`rowspan` (CSS Grid)

### Browser Tests for Visual Spanning

Visual spanning tests use `getBoundingClientRect()` to verify actual cell dimensions. These require a real browser environment (Vitest browser mode).

```typescript
// Table.browser.test.tsx
describe('Table Visual Cell Spanning', () => {
  it('colspan=2 cell has approximately 2x width of normal cell', () => {
    const columns = createColumns(3);
    const rows: TableRow[] = [
      { id: '1', cells: [{ content: 'Merged', colspan: 2 }, 'Single'] },
      { id: '2', cells: ['A', 'B', 'C'] },
    ];

    const { container } = render(<Table columns={columns} rows={rows} />);
    const cells = container.querySelectorAll('[role="cell"]');
    const mergedCell = cells[0];
    const normalCell = cells[3];

    const mergedWidth = mergedCell.getBoundingClientRect().width;
    const normalWidth = normalCell.getBoundingClientRect().width;

    // Allow 20% tolerance for borders/gaps
    expect(mergedWidth).toBeGreaterThan(normalWidth * 1.8);
    expect(mergedWidth).toBeLessThan(normalWidth * 2.2);
  });

  it('rowspan=2 cell has approximately 2x height of normal cell', () => {
    const columns = createColumns(3);
    const rows: TableRow[] = [
      { id: '1', cells: [{ content: 'Spans 2 rows', rowspan: 2 }, 'A', 'B'] },
      { id: '2', cells: ['C', 'D'] },
    ];

    const { container } = render(<Table columns={columns} rows={rows} />);
    const cells = container.querySelectorAll('[role="cell"]');
    const spanningCell = cells[0];
    const normalCell = cells[1];

    const spanningHeight = spanningCell.getBoundingClientRect().height;
    const normalHeight = normalCell.getBoundingClientRect().height;

    expect(spanningHeight).toBeGreaterThan(normalHeight * 1.8);
    expect(spanningHeight).toBeLessThan(normalHeight * 2.2);
  });
});
```

**Note**: jsdom returns zero for `getBoundingClientRect()`. Use Vitest browser mode with Playwright:

```typescript
// vitest.browser.config.ts
export default defineConfig({
  test: {
    include: ['src/**/*.browser.test.{ts,tsx}'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
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

// Virtualization test
test('virtualized table has correct ARIA attributes', async ({ page }) => {
  const virtualizedTable = page.locator('[role="table"][aria-label*="Virtualized"]');
  await expect(virtualizedTable).toBeVisible();

  // Check aria-rowcount and aria-colcount
  await expect(virtualizedTable).toHaveAttribute('aria-rowcount', '100');
  await expect(virtualizedTable).toHaveAttribute('aria-colcount', '3');

  // Check aria-rowindex on data rows
  const dataRows = virtualizedTable.locator('[role="rowgroup"]:last-child [role="row"]');
  await expect(dataRows.nth(0)).toHaveAttribute('aria-rowindex', '5');
  await expect(dataRows.nth(1)).toHaveAttribute('aria-rowindex', '6');
});

// Visual cell spanning test
test('colspan=2 cell has approximately 2x width of normal cell', async ({ page }) => {
  const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
  await expect(spanningTable).toBeVisible();

  const colspanCell = spanningTable.locator('[aria-colspan="2"]').first();
  const normalCell = spanningTable
    .locator('[role="rowgroup"]:last-child [role="cell"]:not([aria-colspan]):not([aria-rowspan])')
    .first();

  const colspanBox = await colspanCell.boundingBox();
  const normalBox = await normalCell.boundingBox();

  expect(colspanBox).not.toBeNull();
  expect(normalBox).not.toBeNull();

  // colspan=2 should be approximately 2x width (20% tolerance)
  expect(colspanBox!.width).toBeGreaterThan(normalBox!.width * 1.8);
  expect(colspanBox!.width).toBeLessThan(normalBox!.width * 2.3);
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="table"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
