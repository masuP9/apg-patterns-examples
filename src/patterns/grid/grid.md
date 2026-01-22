# Grid Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

## Overview

Grid is an interactive container that enables 2-dimensional navigation using arrow keys, Home, End, and other directional keys. Unlike a static table, Grid supports cell selection and keyboard-based cell activation.

## Native HTML vs Custom Implementation

| Use Case | Recommended |
| --- | --- |
| [object Object] | [object Object] |
| [object Object] | [object Object] |
| [object Object] | [object Object] |

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `grid` | Container | The grid container (composite widget) (required) |
| `row` | Row container | Groups cells horizontally (required) |
| `columnheader` | Header cells | Column headers (not focusable in this implementation) |
| `rowheader` | Row header cell | Row headers (optional) |
| `gridcell` | Data cells | Interactive cells (focusable) (required) |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `role="grid"` | [object Object] | - | Yes | Identifies the container as a grid |
| `aria-label` | grid | String | Yes | Accessible name for the grid |
| `aria-labelledby` | grid | ID reference | Yes | Alternative to aria-label |
| `aria-multiselectable` | grid | true | No | Only present for multi-select mode |
| `aria-rowcount` | grid | Number | No | Total rows (for virtualization) |
| `aria-colcount` | grid | Number | No | Total columns (for virtualization) |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `tabindex` | gridcell | `0` \| `-1` | Yes | Roving tabindex for focus management |
| `aria-selected` | gridcell | `true` \| `false` | No | Present when grid supports selection. When selection is supported, ALL gridcells should have aria-selected. |
| `aria-disabled` | gridcell | true | No | Indicates the cell is disabled |
| `aria-rowindex` | row, gridcell | Number | No | Row position (for virtualization) |
| `aria-colindex` | gridcell | Number | No | Column position (for virtualization) |

## Keyboard Support

### 2D Navigation

| Key | Action |
| --- | --- |
| `→` | Move focus one cell right |
| `←` | Move focus one cell left |
| `↓` | Move focus one row down |
| `↑` | Move focus one row up |
| `Home` | Move focus to first cell in row |
| `End` | Move focus to last cell in row |
| `Ctrl + Home` | Move focus to first cell in grid |
| `Ctrl + End` | Move focus to last cell in grid |
| `PageDown` | Move focus down by page size (default 5) |
| `PageUp` | Move focus up by page size (default 5) |

### Selection & Activation

| Key | Action |
| --- | --- |
| `Space` | Select/deselect focused cell (when selectable) |
| `Enter` | Activate focused cell (trigger onCellActivate) |

## Focus Management

- Roving tabindex: Only one cell has tabindex="0" (the focused cell), all others have tabindex="-1"
- Single Tab stop: Grid is a single Tab stop (Tab enters grid, Shift+Tab exits)
- Header cells: Header cells (columnheader) are NOT focusable (no sort functionality in this implementation)
- Data cells only: Only gridcells in the data rows are included in keyboard navigation
- Focus memory: Last focused cell is remembered when leaving and re-entering the grid

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="grid"
- [ ] All rows have role="row"
- [ ] Data cells have role="gridcell"
- [ ] Header cells have role="columnheader"
- [ ] Has accessible name via aria-label or aria-labelledby
- [ ] aria-multiselectable present when multi-select enabled
- [ ] aria-selected present on all cells when selectable
- [ ] aria-disabled present on disabled cells

### Medium Priority: ARIA

- [ ] Virtualization attributes correct when provided

### High Priority: Keyboard

- [ ] ArrowRight/Left/Up/Down navigate in 2D
- [ ] Home/End navigate within row
- [ ] Ctrl+Home/End navigate to grid corners
- [ ] PageUp/PageDown navigate by page size
- [ ] Space toggles cell selection
- [ ] Enter activates focused cell
- [ ] Tab exits grid to next element

### High Priority: Focus Management

- [ ] Roving tabindex implemented correctly
- [ ] Header cells are not focusable
- [ ] Disabled cells are focusable but not activatable

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes


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
```

## Example E2E Test Code (Playwright)

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
