# Data Grid Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/

## Overview

Data Grid is an interactive tabular component with keyboard-driven 2D navigation, sorting, row selection, range selection, and cell editing. Extends the basic Grid pattern with data manipulation capabilities.

## Implementation Status

- 2D keyboard navigation (Arrow keys, Home, End, Ctrl+Home, Ctrl+End)
- Cell selection (single/multi)
- Roving tabindex focus management
- Virtualization support (aria-rowcount/colcount)
- **Sortable column headers (aria-sort, focusable headers)**
- **Row selection with checkboxes**
- **Range selection (Shift+Arrow)**
- **Cell editing (Enter/F2, Escape, aria-readonly)**

### APG Deviations (Intentional)

This implementation includes **two documented deviations** from APG:

1. **Non-sortable headers excluded from navigation**: APG expects all columnheaders to be navigable. This implementation excludes non-sortable headers as they serve no interactive purpose.
2. **Edit mode Tab focus trap (optional)**: APG expects Tab to exit grid during edit mode. This implementation optionally traps focus within cell for complex editors.

## Grid vs DataGrid Key Differences

> Note: These are behavioral differences in this implementation, not APG pattern-level requirements. APG allows interactive headers in basic Grid if needed.

| Feature | Grid (this impl.) | DataGrid (this impl.) |
|---------|-------------------|----------------------|
| Header focusable | No (no sort) | Yes (sortable only) |
| `aria-sort` | No | Yes (ascending/descending/none/other) |
| Row selection | No | Yes (checkbox in gridcell) |
| `aria-selected` on row | No | Yes (when rowSelectable) |
| Range selection | No | Yes (Shift+Arrow, cell-based) |
| Cell editing | No | Yes (Enter/F2 to edit, Escape to cancel) |
| `aria-readonly` | No | Yes (grid-level and cell-level) |

**Selection model**: Choose either row selection OR cell selection, not both simultaneously. `aria-multiselectable` applies to grid element for both models.

## ARIA Requirements

### Roles

| Role | Element | Required | Description |
|------|---------|----------|-------------|
| `grid` | Container | Yes | Grid root element |
| `rowgroup` | Group container | No | Optional grouping for header/body rows (APG-aligned) |
| `row` | Row container | Yes | Each row in grid |
| `gridcell` | Data cell | Yes | Standard data cell |
| `columnheader` | Header cell | Yes | Column header (focusable if sortable) |
| `rowheader` | Row header | No | Row header (first column, optional) |

### Properties

| Attribute | Element | Values | Required | Notes |
|-----------|---------|--------|----------|-------|
| `aria-label` | grid | String | Yes* | Accessible name |
| `aria-labelledby` | grid | ID ref | Yes* | Alternative naming |
| `aria-sort` | columnheader | ascending/descending/none/other | No | Only on sortable columns |
| `aria-rowcount` | grid | Integer (1-based) | No | Total rows (virtualization) |
| `aria-colcount` | grid | Integer (1-based) | No | Total columns (virtualization) |
| `aria-rowindex` | row | Integer (1-based) | No | Row position (virtualization) |
| `aria-colindex` | gridcell, columnheader, rowheader | Integer (1-based) | No | Column position |
| `aria-colspan` | gridcell, columnheader | Integer | No | Multi-column span |
| `aria-rowspan` | gridcell, rowheader | Integer | No | Multi-row span |
| `aria-readonly` | grid | true/false | No | Grid-level read-only state |
| `aria-readonly` | gridcell | true/false | No | Cell-level read-only state |

*Either `aria-label` or `aria-labelledby` required (mutually exclusive)

### States

| Attribute | Element | Values | Required | Change Trigger |
|-----------|---------|--------|----------|----------------|
| `aria-multiselectable` | grid | `true` | No* | When row/cell multi-selection enabled |
| `aria-selected` | row | `true`/`false` | No | Checkbox click, Space on checkbox |
| `aria-selected` | gridcell | `true`/`false` | No | Space key, range selection |
| `aria-disabled` | gridcell, row | `true`/`false` | No | disabled prop |

*Required when rowMultiselectable or multiselectable is true

## Keyboard Support

### Base Navigation (from Grid)

| Key | Action | Notes |
|-----|--------|-------|
| `ArrowRight` | Move to right cell | Within row, skips disabled |
| `ArrowLeft` | Move to left cell | Within row, skips disabled |
| `ArrowDown` | Move to cell below | Or from header to first data row |
| `ArrowUp` | Move to cell above | Or from first data row to sortable header |
| `Home` | First cell in row | Current row |
| `End` | Last cell in row | Current row |
| `Ctrl+Home` | First cell in grid | First data row, first column |
| `Ctrl+End` | Last cell in grid | Last row, last column |
| `PageDown` | Move multiple rows down | Requires `enablePageNavigation` |
| `PageUp` | Move multiple rows up | Requires `enablePageNavigation` |
| `Tab` | Exit grid | Next focusable element |
| `Shift+Tab` | Exit grid | Previous focusable element |
| `Space` | Toggle cell selection | When `selectable`, skips disabled |
| `Enter` | Activate cell | Triggers onCellActivate, skips disabled |
| `Ctrl+A` | Select all cells | When `selectable` AND `multiselectable` |

### Sorting (NEW)

| Key | Action | Notes |
|-----|--------|-------|
| `Enter` on sortable header | Cycle sort | none -> ascending -> descending -> ascending |
| `Space` on sortable header | Cycle sort | Same as Enter |

### Row Selection (NEW)

| Key | Action | Notes |
|-----|--------|-------|
| `Space` on checkbox cell | Toggle row selection | Updates aria-selected on row |
| Click on checkbox | Toggle row selection | Same as Space |

### Range Selection (NEW)

| Key | Action | Notes |
|-----|--------|-------|
| `Shift+ArrowDown` | Extend selection down | Cell-based, sets anchor on first selection |
| `Shift+ArrowUp` | Extend selection up | Cell-based |
| `Shift+Home` | Extend to row start | Current row |
| `Shift+End` | Extend to row end | Current row |
| `Ctrl+Shift+Home` | Extend to grid start | First cell |
| `Ctrl+Shift+End` | Extend to grid end | Last cell |

### Cell Editing (NEW)

| Key | Action | Notes |
|-----|--------|-------|
| `Enter` on editable cell | Enter edit mode | Focus moves to input, grid nav disabled |
| `F2` on editable cell | Enter edit mode | Same as Enter |
| `Escape` in edit mode | Cancel edit | Restore original value, return to grid nav |
| `Tab` in edit mode | Move within cell | Implementation-specific: focus trap within cell widgets* |
| `Shift+Tab` in edit mode | Move backward within cell | Implementation-specific: focus trap* |

> **APG Deviation Note (Edit Mode Tab)**: APG standard expects Tab to exit the grid during edit mode. This implementation **optionally uses focus trap** within cell for complex editors with multiple widgets. This is a documented deviation from APG. For strict APG compliance, use Tab to exit grid; for complex editors, implement focus trap and clearly document the behavior.

## Focus Management

### Header Focusability

- **Sortable headers**: Participate in roving tabindex (`tabindex="0"` or `"-1"`)
- **Non-sortable headers**: NOT focusable (no tabindex)
- ArrowDown from sortable header enters first data row
- ArrowUp from first data row enters header (sortable columns only)

> **APG Deviation Note (Header Focusability)**: APG examples show all column headers as navigable (part of the grid navigation). This implementation **intentionally excludes** non-sortable headers from focus/navigation because they have no interactive purpose. This is a documented deviation from APG. For strict APG compliance, make all headers focusable regardless of sortability.

### Edit Mode Focus

- Edit start: Focus moves from gridcell to internal input/widget
- Edit end: Focus returns to gridcell
- During edit: Grid keyboard navigation is disabled
- Tab/Shift+Tab: Implementation choice (see Cell Editing note above)
  - Option A (APG default): Tab exits grid
  - Option B (this impl.): Tab trapped within cell for complex editors

### Roving Tabindex

- Only focused cell has `tabIndex="0"`, others have `tabIndex="-1"`
- Sortable headers included in roving tabindex
- Position tracked as `[rowIndex, colIndex]` (header row = 0 if sortable)

## Test Checklist

### High Priority: ARIA Attributes

- [ ] Container has `role="grid"`
- [ ] All rows have `role="row"`
- [ ] Data cells have `role="gridcell"`
- [ ] Header cells have `role="columnheader"`
- [ ] Sortable columnheader has `aria-sort` (ascending/descending/none/other)
- [ ] Non-sortable columnheader does NOT have `aria-sort`
- [ ] `aria-sort` updates on sort action
- [ ] Row has `aria-selected` when `rowSelectable`
- [ ] Grid has `aria-label` or `aria-labelledby`
- [ ] Grid has `aria-multiselectable="true"` when multi-selection enabled
- [ ] Grid has `aria-readonly="true"` when readonly prop is true
- [ ] Editable cells have `aria-readonly="false"` (or omitted)
- [ ] Readonly cells have `aria-readonly="true"`
- [ ] Has `aria-rowcount`/`aria-colcount` when virtualizing (1-based)
- [ ] Has `aria-rowindex` on rows when virtualizing (1-based, header row = 1)
- [ ] Has `aria-colindex` on cells/headers/rowheaders when virtualizing (1-based)
- [ ] Has `aria-disabled="true"` on disabled rows/cells
- [ ] Disabled rows/cells are focusable but not selectable
- [ ] Disabled rows/cells cannot be edited
- [ ] Has `role="rowheader"` on first cell when `hasRowHeader` is true
- [ ] Has `aria-colspan` on gridcells with colspan > 1
- [ ] Has `aria-colspan` on columnheaders with colspan > 1
- [ ] Has `aria-rowspan` on gridcells with rowspan > 1
- [ ] Has `aria-rowspan` on rowheaders with rowspan > 1

### High Priority: Keyboard - Base Navigation

- [ ] ArrowRight moves focus one cell right
- [ ] ArrowLeft moves focus one cell left
- [ ] ArrowDown moves focus one row down
- [ ] ArrowUp moves focus one row up
- [ ] ArrowRight stops at row end (no wrap by default)
- [ ] ArrowUp from first data row enters sortable header
- [ ] ArrowDown from header enters first data row
- [ ] Home moves to first cell in row
- [ ] End moves to last cell in row
- [ ] Ctrl+Home moves to first cell in grid
- [ ] Ctrl+End moves to last cell in grid
- [ ] PageDown moves down by pageSize (when enabled)
- [ ] PageUp moves up by pageSize (when enabled)
- [ ] Tab exits grid to next focusable element
- [ ] Shift+Tab exits grid to previous focusable element
- [ ] Navigation skips disabled cells

### High Priority: Keyboard - Sorting

- [ ] Enter on sortable header triggers sort
- [ ] Space on sortable header triggers sort
- [ ] Sort cycles: none -> ascending -> descending -> ascending
- [ ] Non-sortable headers do not respond to Enter/Space

### High Priority: Keyboard - Range Selection

- [ ] Shift+ArrowDown extends selection downward
- [ ] Shift+ArrowUp extends selection upward
- [ ] Shift+Home extends selection to row start
- [ ] Shift+End extends selection to row end
- [ ] Ctrl+Shift+Home extends selection to grid start
- [ ] Ctrl+Shift+End extends selection to grid end
- [ ] Selection anchor is set on first selection

### High Priority: Row Selection

- [ ] Checkbox click toggles row selection
- [ ] Space on checkbox cell toggles row selection
- [ ] `aria-selected` updates on row element
- [ ] `onRowSelectionChange` callback fires

### High Priority: Selection Model Exclusivity

- [ ] Row selection and cell selection are NOT used simultaneously
- [ ] When rowSelectable: `aria-selected` on rows only
- [ ] When selectable (cell): `aria-selected` on gridcells only
- [ ] `aria-multiselectable` on grid (not on individual elements)

### High Priority: Focus Management

- [ ] Sortable columnheaders are focusable (tabindex)
- [ ] Non-sortable columnheaders are NOT focusable
- [ ] First focusable cell has `tabindex="0"`
- [ ] ArrowDown from header enters first data row
- [ ] ArrowUp from first data row enters header (sortable only)
- [ ] Roving tabindex updates correctly

### High Priority: Cell Editing

- [ ] Enter on editable cell enters edit mode
- [ ] F2 on editable cell enters edit mode
- [ ] Escape in edit mode cancels and restores grid navigation
- [ ] Edit mode disables grid keyboard navigation (Arrow keys work in input)
- [ ] Focus moves to input field on edit start
- [ ] Focus returns to cell on edit end
- [ ] `onEditStart` callback fires when entering edit mode
- [ ] `onEditEnd` callback fires when exiting edit mode
- [ ] Non-editable cell does not enter edit mode on Enter/F2
- [ ] Tab in edit mode behavior documented (APG: exit grid; or impl-specific: focus trap)

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] Sort indicators have accessible names
- [ ] Checkboxes have accessible labels

## Implementation Notes

```
Structure:

+-----------------------------------------------------------------+
| div role="grid" aria-label="..." aria-multiselectable="true"    |
| +-------------------------------------------------------------+ |
| | div role="row" (header row)                                 | |
| | +------------+ +------------+ +------------+ +------------+ | |
| | |columnheader| |columnheader| |columnheader| |columnheader| | |
| | |tabIndex=-1 | |tabIndex=0  | |tabIndex=-1 | |no tabIndex | | |
| | |(sortable)  | |(focused)   | |(sortable)  | |(not sort)  | | |
| | |aria-sort=  | |aria-sort=  | |aria-sort=  | |            | | |
| | |"ascending" | |"none"      | |"none"      | |            | | |
| | +------------+ +------------+ +------------+ +------------+ | |
| +-------------------------------------------------------------+ |
| +-------------------------------------------------------------+ |
| | div role="row" aria-selected="true"                         | |
| | +------------+ +------------+ +------------+ +------------+ | |
| | |gridcell    | |gridcell    | |gridcell    | |gridcell    | | |
| | |checkbox    | |tabIndex=-1 | |tabIndex=-1 | |tabIndex=-1 | | |
| | |            | |aria-readonly| |           | |            | | |
| | +------------+ +------------+ +------------+ +------------+ | |
| +-------------------------------------------------------------+ |
| +-------------------------------------------------------------+ |
| | div role="row" aria-selected="false"                        | |
| | +------------+ +------------+ +------------+ +------------+ | |
| | |gridcell    | |gridcell    | |gridcell    | |gridcell    | | |
| | |checkbox    | |tabIndex=-1 | |[input]     | |tabIndex=-1 | | |
| | |            | |            | |edit mode   | |            | | |
| | +------------+ +------------+ +------------+ +------------+ | |
| +-------------------------------------------------------------+ |
+-----------------------------------------------------------------+
```

### Critical Implementation Points

1. **Sortable headers participate in roving tabindex** - non-sortable do not
2. **Checkbox column**: Implementation choice to place in gridcell (controls row selection)
3. **Range selection anchor**: Track anchor cell internally, extend from anchor
4. **Edit mode state**: `isEditing` boolean to toggle navigation behavior
5. **Edit mode focus**: Explicitly move focus to input on edit start, back to cell on end
6. **Tab in edit mode**: APG allows Tab to exit grid; implement focus trap only if complex editors need it
7. **aria-readonly scopes**: Grid-level for entire grid, cell-level for individual cells
8. **Sort cycle**: none -> ascending -> descending -> ascending (loop)
9. **Selection exclusivity**: Use either row selection OR cell selection, not both

### Props Reference

```typescript
type SortDirection = 'ascending' | 'descending' | 'none' | 'other';

interface DataGridColumnDef {
  id: string;
  header: string;
  sortable?: boolean;
  sortDirection?: SortDirection;
  colspan?: number;
}

interface DataGridCellData {
  id: string;
  value: string | number;
  disabled?: boolean;
  colspan?: number;
  rowspan?: number;
  editable?: boolean;
  readonly?: boolean;
}

interface DataGridRowData {
  id: string;
  cells: DataGridCellData[];
  hasRowHeader?: boolean;
  disabled?: boolean;
}

interface DataGridProps {
  // Core
  columns: DataGridColumnDef[];
  rows: DataGridRowData[];

  // Accessible name (one required)
  ariaLabel?: string;
  ariaLabelledby?: string;

  // Row Selection
  rowSelectable?: boolean;
  rowMultiselectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onRowSelectionChange?: (rowIds: string[]) => void;

  // Sorting
  onSort?: (columnId: string, direction: SortDirection) => void;

  // Range Selection
  enableRangeSelection?: boolean;
  onRangeSelect?: (cellIds: string[]) => void;

  // Cell Editing
  editable?: boolean;
  readonly?: boolean;
  editingCellId?: string | null;
  onEditStart?: (cellId: string, rowId: string, colId: string) => void;
  onEditEnd?: (cellId: string, value: string, cancelled: boolean) => void;
  onCellValueChange?: (cellId: string, newValue: string) => void;

  // Focus (from Grid)
  focusedId?: string | null;
  defaultFocusedId?: string;
  onFocusChange?: (id: string | null) => void;

  // Cell Selection (from Grid)
  selectable?: boolean;
  multiselectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;

  // Virtualization (from Grid)
  totalColumns?: number;
  totalRows?: number;
  startRowIndex?: number;
  startColIndex?: number;

  // Behavior (from Grid)
  wrapNavigation?: boolean;
  enablePageNavigation?: boolean;
  pageSize?: number;

  // Callbacks
  onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
  renderCell?: (cell: DataGridCellData, rowId: string, colId: string) => ReactNode;

  className?: string;
}
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Sortable header test
it('Enter on sortable header triggers sort', async () => {
  const onSort = vi.fn();
  const user = userEvent.setup();
  render(
    <DataGrid
      columns={[{ id: 'name', header: 'Name', sortable: true, sortDirection: 'none' }]}
      rows={rows}
      ariaLabel="Test"
      onSort={onSort}
    />
  );

  const header = screen.getByRole('columnheader', { name: 'Name' });
  header.focus();
  await user.keyboard('{Enter}');

  expect(onSort).toHaveBeenCalledWith('name', 'ascending');
});

// Row selection test
it('Space on checkbox toggles row selection', async () => {
  const onRowSelectionChange = vi.fn();
  const user = userEvent.setup();
  render(
    <DataGrid
      columns={columns}
      rows={rows}
      ariaLabel="Test"
      rowSelectable
      onRowSelectionChange={onRowSelectionChange}
    />
  );

  const checkbox = screen.getAllByRole('checkbox')[0];
  checkbox.focus();
  await user.keyboard(' ');

  expect(onRowSelectionChange).toHaveBeenCalledWith(['row-1']);
});

// Edit mode test
it('Enter on editable cell enters edit mode', async () => {
  const onEditStart = vi.fn();
  const user = userEvent.setup();
  render(
    <DataGrid
      columns={columns}
      rows={[{ id: 'row-1', cells: [{ id: 'cell-1', value: 'Hello', editable: true }] }]}
      ariaLabel="Test"
      editable
      onEditStart={onEditStart}
    />
  );

  const cell = screen.getByRole('gridcell');
  cell.focus();
  await user.keyboard('{Enter}');

  expect(onEditStart).toHaveBeenCalledWith('cell-1', 'row-1', expect.any(String));
  expect(screen.getByRole('textbox')).toHaveFocus();
});

// Range selection test
it('Shift+ArrowDown extends selection', async () => {
  const onRangeSelect = vi.fn();
  const user = userEvent.setup();
  render(
    <DataGrid
      columns={columns}
      rows={rows}
      ariaLabel="Test"
      enableRangeSelection
      onRangeSelect={onRangeSelect}
    />
  );

  const firstCell = screen.getAllByRole('gridcell')[0];
  firstCell.focus();
  await user.keyboard('{Shift>}{ArrowDown}{/Shift}');

  expect(onRangeSelect).toHaveBeenCalled();
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('sort cycles through states on header click', async ({ page }) => {
  await page.goto('/patterns/data-grid/react/demo/');
  const header = page.getByRole('columnheader', { name: 'Name' });

  // Initial state
  await expect(header).toHaveAttribute('aria-sort', 'none');

  // First click -> ascending
  await header.click();
  await expect(header).toHaveAttribute('aria-sort', 'ascending');

  // Second click -> descending
  await header.click();
  await expect(header).toHaveAttribute('aria-sort', 'descending');

  // Third click -> ascending (loop)
  await header.click();
  await expect(header).toHaveAttribute('aria-sort', 'ascending');
});

test('row selection via checkbox', async ({ page }) => {
  await page.goto('/patterns/data-grid/react/demo/');
  const row = page.getByRole('row').nth(1);
  const checkbox = row.getByRole('checkbox');

  await expect(row).toHaveAttribute('aria-selected', 'false');

  await checkbox.click();
  await expect(row).toHaveAttribute('aria-selected', 'true');

  await checkbox.click();
  await expect(row).toHaveAttribute('aria-selected', 'false');
});

test('cell editing with Enter and Escape', async ({ page }) => {
  await page.goto('/patterns/data-grid/react/demo/');
  const editableCell = page.getByRole('gridcell', { name: 'Click to edit' });

  // Enter edit mode
  await editableCell.focus();
  await page.keyboard.press('Enter');

  const input = page.getByRole('textbox');
  await expect(input).toBeFocused();

  // Type and cancel
  await input.fill('New Value');
  await page.keyboard.press('Escape');

  // Value should be restored
  await expect(editableCell).not.toContainText('New Value');
  await expect(editableCell).toBeFocused();
});

test('range selection with Shift+Arrow', async ({ page }) => {
  await page.goto('/patterns/data-grid/react/demo/');
  const cells = page.getByRole('gridcell');

  await cells.first().click();
  await page.keyboard.press('Shift+ArrowDown');
  await page.keyboard.press('Shift+ArrowRight');

  // Multiple cells should be selected
  const selectedCells = page.locator('[aria-selected="true"]');
  expect(await selectedCells.count()).toBeGreaterThan(1);
});
```
