# Grid Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

## Overview

Grid is an interactive container that enables 2-dimensional navigation using arrow keys, Home, End, and other directional keys. Unlike a static table, Grid supports cell selection and keyboard-based cell activation.

## Implementation Status

This implementation covers a **Data Grid** (no row-end wrap by default) with:
- ✅ 2D keyboard navigation (Arrow keys, Home, End, Ctrl+Home, Ctrl+End)
- ✅ Cell selection (single/multi)
- ✅ Roving tabindex focus management
- ✅ Virtualization support (aria-rowcount/colcount)
- ❌ Edit mode (no `aria-readonly`)
- ❌ Header sorting (headers not focusable)
- ❌ Range selection (Shift+Arrow)

## Key Differences from Table

| Feature | Table | Grid |
|---------|-------|------|
| Primary role | `table`, `cell` | `grid`, `gridcell` |
| Keyboard navigation | None | Arrow keys required |
| Focus management | None | Roving tabindex required |
| Header focus | None | Optional (only if sortable) |
| Selection | None | Cell/row selection |

## Grid Types

| Type | Row-end wrap | Use case |
|------|--------------|----------|
| Data Grid | No (default) | Tabular data display/manipulation |
| Layout Grid | Yes (`wrapNavigation=true`) | Widget grouping |

## ARIA Requirements

### Roles

| Role | Element | Required | Description |
|------|---------|----------|-------------|
| `grid` | Container | Yes | Grid root element |
| `row` | Row container | Yes | Each row in grid |
| `gridcell` | Data cell | Yes | Standard data cell |
| `columnheader` | Header cell | No | Column header (if present) |
| `rowheader` | Row header | No | Row header (first column, optional) |

> Note: `rowgroup` role is optional and omitted in this implementation for simplicity.

### Properties

| Attribute | Element | Values | Required | Notes |
|-----------|---------|--------|----------|-------|
| `aria-label` | grid | String | Yes* | Accessible name |
| `aria-labelledby` | grid | ID ref | Yes* | Alternative naming |
| `aria-rowcount` | grid | Integer (1-based) | No | Total rows (virtualization) |
| `aria-colcount` | grid | Integer (1-based) | No | Total columns (virtualization) |
| `aria-rowindex` | row, gridcell | Integer (1-based) | No | Row position (virtualization) |
| `aria-colindex` | gridcell, columnheader | Integer (1-based) | No | Column position (virtualization) |
| `aria-colspan` | gridcell, columnheader | Integer | No | Multi-column span |
| `aria-rowspan` | gridcell, rowheader | Integer | No | Multi-row span |

*Either `aria-label` or `aria-labelledby` required (mutually exclusive)

### States

| Attribute | Element | Values | Required | Change Trigger |
|-----------|---------|--------|----------|----------------|
| `aria-multiselectable` | grid | `true`/`false` | No* | multiselectable prop |
| `aria-selected` | gridcell | `true`/`false` | No | Space key, click |
| `aria-disabled` | gridcell | `true`/`false` | No | disabled prop |

*Required when multiselectable

> Note: `aria-readonly` is NOT used in this implementation (no edit functionality).

## Keyboard Support

| Key | Action | Notes |
|-----|--------|-------|
| `ArrowRight` | Move to right cell | Within row (data cells only), skips disabled |
| `ArrowLeft` | Move to left cell | Within row (data cells only), skips disabled |
| `ArrowDown` | Move to cell below | Within column, skips disabled |
| `ArrowUp` | Move to cell above | Within column, skips disabled |
| `Home` | First cell in row | Current row |
| `End` | Last cell in row | Current row |
| `Ctrl+Home` | First cell in grid | First data row, first column |
| `Ctrl+End` | Last cell in grid | Last row, last column |
| `PageDown` | Move multiple rows down | Requires `enablePageNavigation=true`, pageSize rows |
| `PageUp` | Move multiple rows up | Requires `enablePageNavigation=true`, pageSize rows |
| `Tab` | Exit grid | Next focusable element |
| `Shift+Tab` | Exit grid | Previous focusable element |
| `Space` | Toggle cell selection | When `selectable`, disabled cells ignored |
| `Enter` | Activate cell | Triggers onCellActivate, disabled cells ignored |
| `Ctrl+A` | Select all cells | When `selectable` AND `multiselectable` |

## Focus Management

- **Roving tabindex**: Only focused cell has `tabIndex="0"`, others have `tabIndex="-1"`
- **2D tracking**: Position tracked as `[rowIndex, colIndex]`
- **Disabled cells**: Focusable but not activatable
- **Grid entry**: Tab focuses the last-focused cell (or first data cell by default)
- **Header cells**: NOT focusable (no sort functionality in this implementation)

## Test Checklist

### High Priority: ARIA Attributes ✅

- [x] Container has `role="grid"`
- [x] All rows have `role="row"`
- [x] Data cells have `role="gridcell"`
- [x] Header cells have `role="columnheader"`
- [x] Row headers have `role="rowheader"` (when hasRowHeader)
- [x] Has accessible name via `aria-label`
- [x] Has accessible name via `aria-labelledby`
- [ ] ~~Rejects both `aria-label` and `aria-labelledby` simultaneously~~ (not validated)
- [ ] ~~Requires `aria-label` or `aria-labelledby`~~ (not validated)
- [x] Has `aria-multiselectable` when multiselectable
- [x] Has `aria-selected` on selectable cells
- [x] Has `aria-disabled` on disabled cells
- [x] Has `aria-colspan` on spanned cells (gridcell & columnheader)
- [ ] Has `aria-rowspan` on spanned cells (rowheader) - not tested

### High Priority: Keyboard - 2D Navigation ✅

- [x] `ArrowRight` moves focus one cell right
- [x] `ArrowLeft` moves focus one cell left
- [x] `ArrowDown` moves focus one row down
- [x] `ArrowUp` moves focus one row up
- [x] `ArrowRight` stops at row end (default)
- [x] `ArrowRight` wraps to next row (wrapNavigation)
- [x] `ArrowDown` stops at grid bottom
- [x] `ArrowUp` stops at first data row (does not enter headers)
- [x] Skips disabled cells during navigation

### High Priority: Keyboard - Extended Navigation ✅

- [x] `Home` moves to first cell in row
- [x] `End` moves to last cell in row
- [x] `Ctrl+Home` moves to first cell in grid
- [x] `Ctrl+End` moves to last cell in grid
- [x] `PageDown` moves down by pageSize (requires `enablePageNavigation`)
- [x] `PageUp` moves up by pageSize (requires `enablePageNavigation`)

### High Priority: Focus Management ✅

- [x] First focusable cell has `tabIndex="0"` by default
- [x] `defaultFocusedId` sets initial focus
- [x] Other cells have `tabIndex="-1"`
- [x] Focused cell updates tabIndex on navigation
- [x] Disabled cells are focusable
- [x] `Tab` focuses grid, then exits
- [x] `Shift+Tab` exits grid to previous element
- [ ] Maintains focus position after re-render - not explicitly tested
- [ ] Navigates correctly across spanned cells - not explicitly tested
- [x] `columnheader` cells are not focusable

### High Priority: Selection ✅

- [x] `Space` toggles selection (single)
- [x] `Space` toggles selection (multi)
- [x] Single selection clears previous on Space
- [x] `Enter` activates cell
- [x] `Enter` does not activate disabled cell
- [x] `Space` does not select disabled cell
- [x] `Ctrl+A` selects all (`selectable` AND `multiselectable`)
- [x] Updates `aria-selected` on selection change
- [x] Calls `onSelectionChange` callback
- [x] Controlled `selectedIds` overrides internal state

### Medium Priority: Virtualization ✅

- [x] Has `aria-rowcount` when totalRows provided
- [x] Has `aria-colcount` when totalColumns provided
- [x] Has `aria-rowindex` on rows when virtualizing
- [x] Has `aria-colindex` on cells when virtualizing

### Medium Priority: Accessibility ✅

- [x] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

```
Structure (without rowgroup):

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

### Critical Implementation Points

1. **Header cells are NOT focusable** - no sort functionality
2. **No `aria-readonly`** - no edit functionality
3. **No `rowgroup`** - simplified structure
4. **Cell ID convention**: `${rowId}-${colIndex}` for consistent controlled mode
5. **Disabled cells**: Focusable but cannot be selected or activated
6. **CSS Grid layout**: Avoid `order` or `grid-area` reordering (visual/DOM mismatch)

### Props Reference

```typescript
interface GridProps {
  // Required
  columns: GridColumnDef[];
  rows: GridRowData[];

  // Accessible name (one recommended)
  ariaLabel?: string;
  ariaLabelledby?: string;

  // Selection
  selectable?: boolean;           // Enable cell selection
  multiselectable?: boolean;      // Enable multi-selection
  selectedIds?: string[];         // Controlled selection
  defaultSelectedIds?: string[];  // Initial selection
  onSelectionChange?: (ids: string[]) => void;

  // Focus
  focusedId?: string | null;      // Controlled focus
  defaultFocusedId?: string;      // Initial focus target
  onFocusChange?: (id: string | null) => void;

  // Virtualization
  totalColumns?: number;          // Triggers aria-colcount
  totalRows?: number;             // Triggers aria-rowcount
  startRowIndex?: number;         // 1-based, for aria-rowindex
  startColIndex?: number;         // 1-based, for aria-colindex

  // Behavior
  wrapNavigation?: boolean;       // Layout Grid mode
  enablePageNavigation?: boolean; // Enable PageUp/PageDown
  pageSize?: number;              // Default: 5

  // Callbacks
  onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
}

interface GridColumnDef {
  id: string;
  header: string;
  colspan?: number;  // For spanning headers
}

interface GridCellData {
  id: string;
  value: string | number;
  disabled?: boolean;
  colspan?: number;
  rowspan?: number;
}

interface GridRowData {
  id: string;
  cells: GridCellData[];
  hasRowHeader?: boolean;  // First cell becomes rowheader
  disabled?: boolean;
}
```

## Example Test Code (React + Testing Library)

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

// Tab exits grid
it('Tab exits grid to next element', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Grid columns={columns} rows={rows} ariaLabel="Test Grid" />
      <button>Next</button>
    </>
  );

  const cell = screen.getAllByRole('gridcell')[0];
  cell.focus();

  await user.tab();

  expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
});

// Header cells not focusable
it('columnheader cells are not focusable', () => {
  render(<Grid columns={columns} rows={rows} ariaLabel="Test Grid" />);

  const headers = screen.getAllByRole('columnheader');
  headers.forEach(header => {
    expect(header).not.toHaveAttribute('tabIndex');
  });
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';

// ARIA Structure
test('has correct grid structure', async ({ page }) => {
  await page.goto('patterns/grid/react/demo/');
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
  await page.goto('patterns/grid/react/demo/');
  const grid = page.getByRole('grid').first();
  const cells = grid.getByRole('gridcell');
  const headers = grid.getByRole('columnheader');
  const columnCount = await headers.count();

  // Focus first cell
  await cells.first().click({ position: { x: 5, y: 5 } });

  // ArrowRight moves to next cell
  await page.keyboard.press('ArrowRight');
  await expect(cells.nth(1)).toHaveClass(/focused/);

  // ArrowDown moves to next row
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowDown');
  await expect(cells.nth(columnCount)).toHaveClass(/focused/);
});

// Roving Tabindex
test('roving tabindex updates on navigation', async ({ page }) => {
  await page.goto('patterns/grid/react/demo/');
  const grid = page.getByRole('grid').first();
  const cells = grid.getByRole('gridcell');
  const firstCell = cells.first();
  const secondCell = cells.nth(1);

  // Initially first cell has tabindex="0"
  await expect(firstCell).toHaveAttribute('tabindex', '0');
  await expect(secondCell).toHaveAttribute('tabindex', '-1');

  // Navigate right
  await firstCell.click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('ArrowRight');

  // Tabindex should update
  await expect(firstCell).toHaveAttribute('tabindex', '-1');
  await expect(secondCell).toHaveAttribute('tabindex', '0');
});

// Tab exits grid
test('Tab exits grid', async ({ page }) => {
  await page.goto('patterns/grid/react/demo/');
  const grid = page.getByRole('grid').first();
  const cells = grid.getByRole('gridcell');

  await cells.first().click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Tab');

  // Should no longer be focused on any element in the grid
  const gridContainsFocus = await grid.evaluate((el) =>
    el.contains(document.activeElement)
  );
  expect(gridContainsFocus).toBe(false);
});
```
