# Treegrid Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/

## Overview

A treegrid combines Grid 2D keyboard navigation with TreeView hierarchical expand/collapse functionality. Rows can be expanded to show child rows, and selection is on rows rather than cells.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `treegrid` | Container | The treegrid container (composite widget) |
| `row` | Row container | Groups cells horizontally, may have children |
| `columnheader` | Header cells | Column headers (not focusable) |
| `rowheader` | First column cell | Row header where tree operations occur |
| `gridcell` | Data cells | Interactive cells (focusable) |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `role="treegrid"` | Container | - | Yes | Identifies the container as a treegrid |
| `aria-label` | treegrid | String | Yes | Accessible name for the treegrid |
| `aria-labelledby` | treegrid | ID reference | Yes | Alternative to aria-label |
| `aria-multiselectable` | treegrid | true | No | Only present for multi-select mode |
| `aria-rowcount` | treegrid | Number | No | Total rows (for virtualization) |
| `aria-colcount` | treegrid | Number | No | Total columns (for virtualization) |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-level` | row | Number (1-based) | Yes | Static per row (determined by hierarchy) |
| `aria-expanded` | row (parent only) | `true` \| `false` | Yes | ArrowRight/Left at rowheader, click on expand icon |
| `aria-selected` | row | `true` \| `false` | No | Space key, click (NOT on gridcell) |
| `aria-disabled` | row | true | No | Only when row is disabled |
| `aria-rowindex` | row | Number | No | Static (for virtualization) |

## Keyboard Support

### 2D Navigation

| Key | Action |
| --- | --- |
| `Arrow Down` | Move focus to same column in next visible row |
| `Arrow Up` | Move focus to same column in previous visible row |
| `Arrow Right` | Move focus one cell right (at non-rowheader cells) |
| `Arrow Left` | Move focus one cell left (at non-rowheader cells) |
| `Home` | Move focus to first cell in row |
| `End` | Move focus to last cell in row |
| `Ctrl + Home` | Move focus to first cell in treegrid |
| `Ctrl + End` | Move focus to last cell in treegrid |

### Tree Operations (at rowheader only)

| Key | Action |
| --- | --- |
| `Arrow Right (at rowheader)` | If collapsed parent: expand row. If expanded parent: move to first child's rowheader. If leaf: do nothing |
| `Arrow Left (at rowheader)` | If expanded parent: collapse row. If collapsed/leaf: move to parent's rowheader. If at root level collapsed: do nothing |

### Row Selection & Cell Activation

| Key | Action |
| --- | --- |
| `Space` | Toggle row selection (NOT cell selection) |
| `Enter` | Activate focused cell (does NOT expand/collapse) |
| `Ctrl + A` | Select all visible rows (when multiselectable) |

## Focus Management

- Focus model: Roving tabindex - only one cell has tabindex="0"
- Other cells: tabindex="-1"
- TreeGrid: Single Tab stop (Tab enters/exits the grid)
- Column headers: NOT focusable (no tabindex)
- Collapsed children: NOT in keyboard navigation
- Parent collapses: If focus was on child, move focus to parent

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="treegrid"
- [ ] Each row has role="row"
- [ ] First cell has role="rowheader"
- [ ] Other cells have role="gridcell"
- [ ] Header cells have role="columnheader"
- [ ] All rows have aria-level
- [ ] Parent rows have aria-expanded (true/false)
- [ ] Selection uses aria-selected on row (not cell)

### High Priority: Keyboard

- [ ] ArrowRight expands collapsed parent at rowheader
- [ ] ArrowLeft collapses expanded parent at rowheader
- [ ] ArrowRight/Left navigate cells at non-rowheader
- [ ] ArrowDown/Up navigate visible rows
- [ ] Home/End navigate to first/last cell in row
- [ ] Ctrl+Home/End navigate to first/last cell in treegrid
- [ ] Space toggles row selection
- [ ] Enter activates cell (does NOT expand/collapse)

### High Priority: Focus Management

- [ ] Focused cell has tabIndex="0"
- [ ] Other cells have tabIndex="-1"
- [ ] Column headers are not focusable
- [ ] Tab enters/exits treegrid (single tab stop)
- [ ] Focus moves to parent when child collapses

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

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

## Example Test Code (React + Testing Library)

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

## Example E2E Test Code (Playwright)

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
