# Data Grid Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

## Overview

A data grid presents tabular data with interactive cells that support navigation, selection, and editing.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `grid` | Container | Identifies the element as a grid. The grid contains rows of cells. |
| `row` | Each row | Identifies a row of cells |
| `gridcell` | Each cell | Identifies an interactive cell in the grid |
| `rowheader` | Row header cell | Identifies a cell as a header for its row |
| `columnheader` | Column header cell | Identifies a cell as a header for its column |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-rowcount` | grid | Total number of rows | No | Required when rows are virtualized |
| `aria-colcount` | grid | Total number of columns | No | Required when columns are hidden or virtualized |
| `aria-rowindex` | [object Object] | Row's position in the grid | No | Required when rows are virtualized |
| `aria-colindex` | [object Object] | Column's position in the grid | No | Required when columns are hidden or virtualized |
| `aria-sort` | columnheader | `"ascending"` \| `"descending"` \| `"none"` \| `"other"` | No | Indicates the sorting state of a column |
| `aria-describedby` | grid | ID reference to description element | No | Provides additional context about the grid |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-selected` | gridcell or row | `true` \| `false` | No | Click, Space, Ctrl/Cmd+Click |
| `aria-readonly` | grid or gridcell | `true` \| `false` | No | Grid/cell configuration |
| `aria-disabled` | grid, row, or gridcell | `true` \| `false` | No | Grid/row/cell state change |

## Keyboard Support

| Key | Action |
| --- | --- |
| `ArrowRight` | Move focus one cell to the right. Wraps to next row if at end. |
| `ArrowLeft` | Move focus one cell to the left. Wraps to previous row if at start. |
| `ArrowDown` | Move focus one cell down. |
| `ArrowUp` | Move focus one cell up. |
| `Home` | Move focus to the first cell in the row. |
| `End` | Move focus to the last cell in the row. |
| `Ctrl + Home` | Move focus to the first cell in the grid. |
| `Ctrl + End` | Move focus to the last cell in the grid. |
| `Page Down` | Move focus down by a page (implementation-defined). |
| `Page Up` | Move focus up by a page (implementation-defined). |
| `Space / Enter` | Activate the cell (e.g., edit, select). |
| `Escape` | Cancel edit mode or deselect. |

## Focus Management

- Grid: tabindex="0" on container or first focusable cell
- Focused cell: tabindex="0"
- Other cells: tabindex="-1"
- Interactive content in cells: Focus moves into cell content on Enter, out on Escape

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="grid"
- [ ] Each row has role="row"
- [ ] Each cell has role="gridcell"
- [ ] Grid has correct aria-rowcount
- [ ] Grid has correct aria-colcount
- [ ] Rows have correct aria-rowindex
- [ ] Cells have correct aria-colindex

### High Priority: Keyboard

- [ ] ArrowRight moves focus to next cell
- [ ] ArrowLeft moves focus to previous cell
- [ ] ArrowDown moves focus to cell below
- [ ] ArrowUp moves focus to cell above
- [ ] Home moves focus to first cell in row
- [ ] End moves focus to last cell in row
- [ ] Ctrl+Home moves focus to first cell in grid
- [ ] Ctrl+End moves focus to last cell in grid

### High Priority: Focus Management

- [ ] Focused cell has tabIndex="0"
- [ ] Other cells have tabIndex="-1"
- [ ] Only one tabIndex="0" in grid at any time

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

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

## Example Test Code (React + Testing Library)

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

## Example E2E Test Code (Playwright)

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
